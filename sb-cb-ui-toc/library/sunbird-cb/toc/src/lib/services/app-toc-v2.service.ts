import { Injectable } from '@angular/core';
import { AppTocService } from './app-toc.service';
import { NsContent } from '@sunbird-cb/utils-v2';
@Injectable({
  providedIn: 'root'
})
export class AppTocV2Service {

  constructor(private tocSvc: AppTocService) { }

  constructHeirarchyData(contentReadData: any): any {
    let contentHeirarchy: any = { ...contentReadData }
    let leafNodes: string[] = []
    if (contentHeirarchy['preliminaryAssessmentDetail'] && Object.keys(contentHeirarchy['preliminaryAssessmentDetail']).length > 0) {
      contentHeirarchy['children'] = []
      // Set parent reference for preliminary assessment (pre-assessment)
      contentHeirarchy['preliminaryAssessmentDetail'].parent = contentHeirarchy.identifier
      // Mark this as the pre-assessment for milestone locking logic
      contentHeirarchy['preliminaryAssessmentDetail'].isPreAssessment = true
      
     
      contentHeirarchy['children'].push(contentHeirarchy['preliminaryAssessmentDetail'])
      leafNodes.push(contentReadData?.preliminaryAssessment || contentReadData?.preliminaryAssessmentDetail?.identifier)
    }

    // Track milestone index for proper locking logic
    // All milestones are locked by default - unlocking is computed based on progress
    let milestoneIndex = 0
    contentHeirarchy['milestones_v1'].forEach((milestone: any) => {
      // All milestones are locked by default
      // M1 unlocks when pre-assessment is completed
      // M2+ unlock when previous milestone's mandatory content + assessment are completed
      const shouldBeLocked = true

      let mileStoneData: any = {
        "identifier": milestone.id,
        "description": milestone.description,
        "mimeType": "application/vnd.ekstep.content-collection",
        "duration": "0",
        "primaryCategory": "Milestone",
        "courseCategory": "Milestone",
        "createdBy": "25311a4f-fa42-4cf7-882a-5e79198edfcb",
        "name": milestone.name,
        "contentType": "Course",
        "isLocked": shouldBeLocked,
        "milestoneIndex": milestoneIndex,
        "status": 0,
        "completionStatus": 0,
        "completionPercentage": 0,
        "leafNodes": [],
        // Pre-computed flags for performance optimization
        "isMilestone": true,
        "isCollection": true,
        "isModule": false,
        "isResource": false,
        "isLearningPathway": false,
        "parent": contentHeirarchy.identifier
      }

      mileStoneData['children'] = []
      if (milestone?.courses && milestone?.courses?.length) {
        milestone.courses.forEach((mileStoneCourse: any) => {
          // Set parent reference for courses inside milestone
          mileStoneCourse.parent = milestone.id
          mileStoneCourse['moduleCount'] = 0
          mileStoneData['duration'] = String(Number(mileStoneData['duration']) + Number(mileStoneCourse?.duration || 0))
          this.tocSvc.mapModuleCount(mileStoneCourse)
          if (mileStoneCourse && mileStoneCourse?.leafNodes && mileStoneCourse?.leafNodes?.length) {
            leafNodes = [...leafNodes, ...mileStoneCourse.leafNodes]
            mileStoneData['leafNodes'] = [...mileStoneData?.leafNodes, ...mileStoneCourse.leafNodes]

          }
          this.tocSvc.checkModuleWiseData(mileStoneCourse)
        })

      }
      if (milestone?.assessmentDetail) {
        // Set parent reference for assessment inside milestone
        milestone.assessmentDetail.parent = milestone.id
        leafNodes.push(milestone?.assessmentDetail?.identifier)
        mileStoneData['leafNodes'] = [...mileStoneData?.leafNodes, milestone?.assessmentDetail?.identifier]
        mileStoneData['children'].push(milestone?.assessmentDetail)
      }
      mileStoneData['children'] = [...milestone['courses'], ...mileStoneData['children']]
      mileStoneData['leafNodesCount'] = mileStoneData['leafNodes'].length
        this.mapModuleCount(mileStoneData)
      contentHeirarchy['children'] = contentHeirarchy['children'] ? [...contentHeirarchy['children'], mileStoneData] : [mileStoneData]

      milestoneIndex++
    })
    contentHeirarchy['leafNodes'] = [...leafNodes]
    contentHeirarchy['leafNodesCount'] = leafNodes.length
    return contentHeirarchy
  }

   mapModuleCount(content: NsContent.IContent) {
      if (content && content.children) {
        content.children.map(child => {
          if (child.primaryCategory === NsContent.EPrimaryCategory.COURSE) {
            if(child?.moduleCount) {
            content['moduleCount'] = content['moduleCount'] ? content['moduleCount'] + child?.moduleCount : 
            child?.moduleCount
            }
          }
        })
      }
    }


  mapContentHierarchyProgressUpdate(contentHeirarchyData: any, enrollmentListData: any) {
    if (contentHeirarchyData && contentHeirarchyData.children) {
      let totalLeafNodes = 0
      let totalCompletedLeafNodes = 0
      let LPenrollment = this.findEnrollment(enrollmentListData, contentHeirarchyData?.identifier)

      // First pass: Update progress for all content
      contentHeirarchyData.children.forEach((child: any) => {
        if (child.primaryCategory === 'Milestone') {
          this.updateMilestoneProgress(child, contentHeirarchyData?.identifier, enrollmentListData)
          // Only count mandatory course resources and milestone assessments
          totalLeafNodes += child.mandatoryLeafNodesCount || 0
          totalCompletedLeafNodes += child.mandatoryCompletedLeafNodesCount || 0
        } else {
          // For pre-assessment and other root-level content (always count these)
          // Try to find enrollment with parent identifier first, then with child's own identifier
          let enrollment = this.findEnrollment(enrollmentListData, contentHeirarchyData?.identifier)
          if (!enrollment) {
            enrollment = this.findEnrollment(enrollmentListData, child?.identifier)
          }
          this.updateNodeProgress(child, enrollment)
          const isCompleted = child.status === 2 || child.completionStatus === 2 || child.completionPercentage >= 100
          totalLeafNodes += child.leafNodesCount || 1
          totalCompletedLeafNodes += isCompleted ? (child.leafNodesCount || 1) : 0
        }
      })
      if(LPenrollment && LPenrollment.completionPercentage === 100) {
        contentHeirarchyData.completionPercentage = 100
        contentHeirarchyData.completionStatus = 2
      } else {
        if (totalLeafNodes > 0) {
          const calculatedPercentage = Math.round((Number(totalCompletedLeafNodes) / Number(totalLeafNodes)) * 100)
          contentHeirarchyData.completionPercentage = isNaN(calculatedPercentage) ? 0 : calculatedPercentage
          contentHeirarchyData.completionStatus = Number(contentHeirarchyData.completionPercentage === 100 ? 2 : (contentHeirarchyData.completionPercentage > 0 ? 1 : 0))
        }
      }
    }
    return contentHeirarchyData
  }

  private updateMilestoneProgress(milestone: any, parentContentIdentifier: string, enrollmentListData: any) {
    let totalLeafNodes = 0
    let totalCompletedLeafNodes = 0
    let mandatoryLeafNodes = 0
    let mandatoryCompletedLeafNodes = 0
    let completedCourses = 0
    let totalCourses = 0

    if (milestone.children) {
      milestone.children.forEach((child: any) => {
        if (child.primaryCategory === 'Course') {
          totalCourses += 1
          this.updateCourseProgress(child, parentContentIdentifier, enrollmentListData)
          
          const childLeafNodes = child.leafNodesCount || 1
          const isCompleted = child.status === 2 || child.completionStatus === 2 || child.completionPercentage >= 100
          
          // Count all course leaf nodes for overall tracking
          totalLeafNodes += childLeafNodes
          if (isCompleted) {
            completedCourses += 1
            totalCompletedLeafNodes += childLeafNodes
          }
          
          // Only count mandatory courses for LP completion percentage
          if (child.isMandatory === true || child.mandatory === true) {
            mandatoryLeafNodes += childLeafNodes
            // Count individual completed resources within mandatory courses
            const completedCount = this.getCompletedLeafNodesCount(child)
            mandatoryCompletedLeafNodes += completedCount
          }
        } else {
          // For assessments - always count them as mandatory
          // Try multiple enrollment sources
          let enrollment = this.findEnrollment(enrollmentListData, parentContentIdentifier)
          if (!enrollment) {
            enrollment = this.findEnrollment(enrollmentListData, milestone?.identifier)
          }
          this.updateNodeProgress(child, enrollment)
          
          const leafNodes = child.leafNodesCount || 1
          const isCompleted = child.status === 2 || child.completionStatus === 2 || child.completionPercentage >= 100
          
          // Count assessments in both total and mandatory
          totalLeafNodes += leafNodes
          mandatoryLeafNodes += leafNodes
          if (isCompleted) {
            totalCompletedLeafNodes += leafNodes
            mandatoryCompletedLeafNodes += leafNodes
          }
        }
      })
    }

    milestone.leafNodesCount = totalLeafNodes
    milestone.completedLeafNodesCount = totalCompletedLeafNodes
    milestone.mandatoryLeafNodesCount = mandatoryLeafNodes
    milestone.mandatoryCompletedLeafNodesCount = mandatoryCompletedLeafNodes
    milestone.totalCourses = totalCourses
    milestone.completedCourses = completedCourses

    if (totalLeafNodes > 0) {
      const calculatedPercentage = Math.round((totalCompletedLeafNodes / totalLeafNodes) * 100)
      milestone.completionPercentage = isNaN(calculatedPercentage) ? 0 : calculatedPercentage
      milestone.completionStatus = Number(milestone.completionPercentage === 100 ? 2 : (milestone.completionPercentage > 0 ? 1 : 0))
      milestone.status = Number(milestone.completionPercentage === 100 ? 2 : (milestone.completionPercentage > 0 ? 1 : 0))
    }
  }

  private updateNodeProgress(node: any, enrollment: any) {
    if (!enrollment) {
      // If no enrollment data, preserve existing completion data from content hierarchy
      // This is important for assessments that may have completion data but no enrollment entry
      if (node.completionPercentage === undefined && node.completionStatus === undefined && node.status === undefined) {
        node.completionPercentage = 0
        node.completionStatus = 0
        node.status = 0
      }
      // Otherwise, keep the existing values from content hierarchy
      return
    }

    // Check if the node itself is the enrolled content (direct enrollment)
    // This happens for pre-assessments and standalone content
    const isDirectEnrollment = enrollment.collectionId === node.identifier || 
                                enrollment.contentId === node.identifier
    
    if (isDirectEnrollment) {
      
      // Use enrollment's direct progress
      const progress = enrollment.completionPercentage || enrollment.progress || 0
      const status = Number(enrollment.status) || 0
      
      node.completionPercentage = progress
      node.completionStatus = status
      node.status = status
      
      
      return
    }
    if(enrollment?.status === 2) {
      node.completionPercentage = 100
      node.completionStatus = 2
      node.status = 2
    } else {
      // Try both contentId and collectionId as the API response may use either field
      const nodeEnrollData = enrollment?.contentList?.find((ele: any) => 
        ele?.contentId === node.identifier || ele?.collectionId === node.identifier
      )
      
      if (enrollment && nodeEnrollData && nodeEnrollData.status < 2) {
        node.completionPercentage = nodeEnrollData.completionPercentage || nodeEnrollData.progress || 0
        node.completionStatus = Number(nodeEnrollData.status) || 0
        node.status = Number(nodeEnrollData.status) || 0
      }else if (enrollment && nodeEnrollData && nodeEnrollData.status === 2) {
        node.completionPercentage = 100
        node.completionStatus = 2
        node.status = 2
      } else if (enrollment && !nodeEnrollData) {
        // Enrollment exists but this node is not in contentList
        // This can happen for completed assessments - preserve their completion data from content hierarchy
        // Only reset to 0 if there's no completion data at all
        if (node.completionPercentage === undefined && node.completionStatus === undefined && node.status === undefined) {
          node.completionPercentage = 0
          node.completionStatus = 0
          node.status = 0
        }
        // Otherwise keep existing values from content hierarchy
      } else {
        // No enrollment at all - reset to 0
        node.completionPercentage = 0
        node.completionStatus = 0
        node.status = 0
      }
    }
    
    
    
  }

  private updateCourseProgress(course: any, parentContentIdentifier, enrollmentListData: any) {
    const enrollment = this.findEnrollment(enrollmentListData, course?.identifier)

    if (enrollment?.completionPercentage === 100) {
      // Enrollment shows 100% - mark course as complete
      course.completionPercentage = 100
      course.completionStatus = 2
      if (enrollment.issuedCertificates.length > 0) {
                  const certificate: any = enrollment.issuedCertificates.sort((a: any, b: any) =>
                    new Date(a.lastIssuedOn).getTime() - new Date(b.lastIssuedOn).getTime())
                  const certId: any = certificate[0].identifier
                  course.issuedCertificatesId = certId
                }
        this.tocSvc.mapCompletionChildPercentageProgram(course)
    } else if (enrollment && enrollment.completionPercentage > 0) {
      // Enrollment has partial progress
      course.completionPercentage = enrollment.completionPercentage || 0
      course.completionStatus = 1
      // Also update children
      if (course.children && course.children.length > 0) {
        course.children.forEach((child: any) => {
          

          // If child is a module, update its children (resources) as well
          if (child.primaryCategory === NsContent.EPrimaryCategory.MODULE && child.children && child.children.length > 0) {
            child.children.forEach((resource: any) => {
              this.updateNodeProgress(resource, enrollment)
            })
          } else {
          this.updateNodeProgress(child, enrollment)
          }
        })
      }
    } else {
      if (course.children && course.children.length > 0) {
        let totalLeafNodes = course.leafNodesCount || 0
        let totalCompleted = 0

        course.children.forEach((child: any) => {
          
          // If child is a module, update its children (resources) as well
          if (child.primaryCategory === NsContent.EPrimaryCategory.MODULE && child.children && child.children.length > 0) {
            child.children.forEach((resource: any) => {
              this.updateNodeProgress(resource, enrollment)
              if (resource.completionStatus === 2 || resource.completionPercentage === 100) {
                totalCompleted += resource.leafNodesCount || 1
              }
            })
          } else {
          this.updateNodeProgress(child, enrollment)

          }
          if (child.completionStatus === 2 || child.completionPercentage === 100) {
            totalCompleted += child.leafNodesCount || 1
          }
        })

        // If it's a collection and doesn't have its own enrollment progress, calculate it
        if (!enrollment || !course.completionPercentage || course.completionPercentage === 0) {
          if (!totalLeafNodes) {
            totalLeafNodes = course.children.reduce((acc: number, curr: any) => acc + (curr.leafNodesCount || 1), 0)
          }
          if (totalLeafNodes > 0) {
            const calculatedPercentage = Math.round((totalCompleted / totalLeafNodes) * 100)
            course.completionPercentage = isNaN(calculatedPercentage) ? 0 : calculatedPercentage
            course.completionStatus = Number(course.completionPercentage === 100 ? 2 : (course.completionPercentage > 0 ? 1 : 0))

          }
        }
      }
    }
  }

  private getCompletedLeafNodesCount(node: any): number {
    let completedCount = 0
    
    // If it's a leaf node (resource)
    if (!node.children || node.children.length === 0) {
      const isCompleted = node.status === 2 || node.completionStatus === 2 || node.completionPercentage >= 100
      return isCompleted ? (node.leafNodesCount || 1) : 0
    }
    
    // If it has children, recursively count completed leaf nodes
    node.children.forEach((child: any) => {
      if (child.primaryCategory === NsContent.EPrimaryCategory.MODULE && child.children) {
        // Module - recurse through its children
        completedCount += this.getCompletedLeafNodesCount(child)
      } else if (!child.children || child.children.length === 0) {
        // Resource (leaf node)
        const isCompleted = child.status === 2 || child.completionStatus === 2 || child.completionPercentage >= 100
        if (isCompleted) {
          completedCount += child.leafNodesCount || 1
        }
      } else {
        // Other collection type - recurse
        completedCount += this.getCompletedLeafNodesCount(child)
      }
    })
    
    return completedCount
  }

  private findEnrollment(enrollmentList: any, identifier: string) {
    if (!enrollmentList || !enrollmentList.length) return null
    return enrollmentList.find((el: any) => el.collectionId === identifier || el.contentId === identifier)
  }



}

