import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map } from 'rxjs/operators'
import { v4 as uuid } from 'uuid'
import { NsAssessment } from './assessment.model'

const API_END_POINTS = {
  CREARE_ASSESSMENT: 'apis/proxies/v8/questionset/v1/create',
  UPDATE_ASSESSMENT: 'apis/proxies/v8/questionset/v1/hierarchy/update',
  QUESTIONSET_READ: (id: any) => `apis/proxies/v8/questionset/v1/read/${id}`,
  QUESTIONSET_READ_MODE_EDIT: (id: any) => `apis/proxies/v8/questionset/v1/read/${id}?mode=edit`,
  QUESTIONSET_HIERARCHY: (id: any) => `apis/proxies/v8/questionset/v1/hierarchy/${id}`,
  QUESTIONSET_HIERARCHY_MODE_EDIT: (id: any) => `apis/proxies/v8/questionset/v1/hierarchy/${id}?mode=edit`,
  QUESTION_READ_MODE_EDIT: `apis/proxies/v8/cbp/question/list?editMode=true`,
}

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {

  private assessmentHierarchyData: any = {}
  readOnly: boolean = false

  constructor(
    private http: HttpClient
  ) { }

  getAssessmentHierarchyDetails(assessmentId: string) {
    return this.http.get<any>(API_END_POINTS.QUESTIONSET_HIERARCHY(assessmentId)).pipe(
      map((response: any) => {
        this.assessmentHierarchyData = response.result.questionSet
        return this.assessmentHierarchyData
      })
    )
  }

  getAssessmentHierarchyDetailsModeEdit(assessmentId: string) {
    return this.http.get<any>(API_END_POINTS.QUESTIONSET_HIERARCHY_MODE_EDIT(assessmentId)).pipe(
      map((response: any) => {
        this.assessmentHierarchyData = response.result.questionSet
        return this.assessmentHierarchyData
      })
    )
  }

  getAssessmentHierarchyData() {
    return this.assessmentHierarchyData
  }

  getAssessmentReadDetails(assessmentId: string) {
    return this.http.get<any>(API_END_POINTS.QUESTIONSET_READ(assessmentId)).pipe(
      map((response: any) => {
        return response.result.questionSet
      })
    )
  }

  getAssessmentReadDetailsModeEdit(assessmentId: string) {
    return this.http.get<any>(API_END_POINTS.QUESTIONSET_READ_MODE_EDIT(assessmentId)).pipe(
      map((response: any) => {
        return response.result.questionSet
      })
    )
  }

  createAssessment(assessmentReqData: any) {
    return this.http.post<any>(API_END_POINTS.CREARE_ASSESSMENT, assessmentReqData).pipe(
      map((response: any) => {
        return response
      })
    )
  }

  updateAssessment(assessmentHierarchyReqData: any) {
    return this.http.patch<any>(API_END_POINTS.UPDATE_ASSESSMENT, assessmentHierarchyReqData).pipe(
      map((response: any) => {
        return response
      })
    )
  }

  updateAssessmentHierarchyRequest(changedData: any, identifier: string, parentChanges?: any) {
    const nodesModified: any = {}

    // Determine if the identifier is root by comparing with assessmentHierarchyData
    const isRoot = this.assessmentHierarchyData && identifier === this.assessmentHierarchyData.identifier

    // Add node with changed metadata
    nodesModified[identifier] = {
      isNew: false,
      root: isRoot,
      metadata: changedData,
      objectType: 'QuestionSet'
    }

    // If parentChanges are provided and this is not the root, add parent update
    if (parentChanges && !isRoot && this.assessmentHierarchyData && this.assessmentHierarchyData.identifier) {
      const rootId = this.assessmentHierarchyData.identifier
      nodesModified[rootId] = {
        isNew: false,
        root: true,
        metadata: parentChanges,
        objectType: 'QuestionSet'
      }
    }

    // If updateChildren flag is present, update all children with the specified updates
    if (changedData.updateChildren && changedData.childrenUpdates) {
      if (this.assessmentHierarchyData.children && this.assessmentHierarchyData.children.length > 0) {
        this.assessmentHierarchyData.children.forEach((child: any) => {
          nodesModified[child.identifier] = {
            isNew: false,
            root: false,
            metadata: changedData.childrenUpdates,
            objectType: 'QuestionSet'
          }
        })
      }

      // Remove the updateChildren flag from the root metadata as it's not a valid API field
      delete nodesModified[identifier].metadata.updateChildren
      delete nodesModified[identifier].metadata.childrenUpdates
    }

    // Create the hierarchy structure using existing hierarchy data
    const hierarchy: any = {}

    if (this.assessmentHierarchyData) {
      // Always include the root assessment in hierarchy
      const rootIdentifier = this.assessmentHierarchyData.identifier
      hierarchy[rootIdentifier] = {
        name: this.assessmentHierarchyData.name,
        root: true,
        children: this.assessmentHierarchyData.children?.map((child: any) => child.identifier) || []
      }

      if (parentChanges) {
        nodesModified[rootIdentifier] = {
          isNew: false,
          root: true,
          metadata: parentChanges,
          objectType: 'QuestionSet'
        }
      }

      // Add all existing children to hierarchy with their children arrays
      if (this.assessmentHierarchyData.children && this.assessmentHierarchyData.children.length > 0) {
        this.assessmentHierarchyData.children.forEach((child: any) => {
          hierarchy[child.identifier] = {
            children: child.children?.map((grandchild: any) => grandchild.identifier) || []
          }
        })
      }
    }

    return {
      request: {
        data: {
          nodesModified: nodesModified,
          hierarchy: hierarchy
        }
      }
    }
  }

  getQuestionReadDetailsModeEdit(reqBody: any) {
    return this.http.post<any>(API_END_POINTS.QUESTION_READ_MODE_EDIT, reqBody).pipe(
      map((response: any) => {
        return response
      })
    )
  }

  createAssessmentHierarchyRequest(assessmentData: any, identifier?: string) {
    const nodesModified: any = {}
    const children: string[] = []

    // Calculate duration per section
    const totalDuration = assessmentData.expectedDuration || 0
    const numberOfSections = assessmentData.children?.length || 1
    const durationPerSection = Math.floor(totalDuration / numberOfSections)
    let remainingDuration = totalDuration - (durationPerSection * numberOfSections)

    // Create nodes for each section
    if (assessmentData.children && assessmentData.children.length > 0) {
      assessmentData.children.forEach((section: any, index: number) => {
        // Generate a unique ID for each section
        const sectionId = this.generateUUID()
        children.push(sectionId)

        // Determine section type based on paragraph flag
        const sectionType = section.paragraph ? 'paragraph' : 'section'
        const sectionName = section.paragraph ? `Paragraph ${String.fromCharCode(65 + index)}` : `Section ${String.fromCharCode(65 + index)}`

        // Distribute remaining duration to first sections
        const sectionDuration = durationPerSection + (remainingDuration > 0 ? 1 : 0)
        if (remainingDuration > 0) {
          remainingDuration--
        }

        nodesModified[sectionId] = {
          isNew: true,
          root: false,
          objectType: 'QuestionSet',
          metadata: {
            maxQuestions: section.totalQuestions || 0,
            mimeType: 'application/vnd.sunbird.questionset',
            minimumPassPercentage: assessmentData.minimumPassPercentage || 0,
            name: sectionName,
            primaryCategory: assessmentData.primaryCategory,
            totalQuestions: section.totalQuestions || 0,
            sectionLevelDefinition: section.sectionLevelDefinition,
            compatibilityLevel: assessmentData.compatibilityLevel === 'basic' ? 7 : 8,
            expectedDuration: sectionDuration,
            totalMarks: section.totalMarks || 0,
            sectionType: sectionType
          }
        }
      })
    }

    // Create the hierarchy structure
    const hierarchy: any = {}
    hierarchy[identifier] = {
      name: assessmentData.name,
      root: true,
      children: children
    }

    return {
      request: {
        data: {
          nodesModified: nodesModified,
          hierarchy: hierarchy
        }
      }
    }
  }

  generateUUID(): string {
    return uuid()
  }

  buildQuestionHierarchyRequest(questionData: any, sectionIdentifier: string): any {
    // Get all question UUIDs from questionData (could be single or multiple)
    const questionUUIDs = Object.keys(questionData)

    // Get current assessment hierarchy
    const currentHierarchy = this.getAssessmentHierarchyData()

    // Build hierarchy structure
    const hierarchy: any = {}

    // Add root assessment node
    if (currentHierarchy && currentHierarchy.identifier) {
      const rootId = currentHierarchy.identifier
      hierarchy[rootId] = {
        name: currentHierarchy.name,
        root: true,
        children: currentHierarchy.children?.map((child: any) => child.identifier) || []
      }

      // Add all section nodes with their children
      if (currentHierarchy.children && currentHierarchy.children.length > 0) {
        currentHierarchy.children.forEach((section: any) => {
          const sectionId = section.identifier
          let sectionChildren = section.children?.map((child: any) => child.identifier) || []

          // If this is the target section, add all new questions to children
          if (sectionId === sectionIdentifier) {
            questionUUIDs.forEach(questionUUID => {
              const questionInfo = questionData[questionUUID]
              // Add new question to section children if not already present
              if (questionInfo.isNew && !sectionChildren.includes(questionUUID)) {
                sectionChildren = [...sectionChildren, questionUUID]
              }
            })
          }

          hierarchy[sectionId] = {
            children: sectionChildren
          }
        })
      }
    }

    // Build the complete request structure
    return {
      request: {
        data: {
          nodesModified: questionData,
          hierarchy: hierarchy
        }
      }
    }
  }

  deleteQuestionHierarchyRequest(questionIdentifier: any, sectionIdentifier: string): any {
    // Get current assessment hierarchy
    const currentHierarchy = this.getAssessmentHierarchyData()

    // Build hierarchy structure
    const hierarchy: any = {}

    // Add root assessment node
    if (currentHierarchy && currentHierarchy.identifier) {
      const rootId = currentHierarchy.identifier
      hierarchy[rootId] = {
        name: currentHierarchy.name,
        root: true,
        children: currentHierarchy.children?.map((child: any) => child.identifier) || []
      }

      // Add all section nodes with their children
      if (currentHierarchy.children && currentHierarchy.children.length > 0) {
        currentHierarchy.children.forEach((section: any) => {
          const sectionId = section.identifier
          let sectionChildren = section.children?.filter((child: any) => child.identifier !== questionIdentifier) || []

          hierarchy[sectionId] = {
            children: sectionChildren.map((child: any) => child.identifier) || []
          }
        })
      }
    }

    // Build the complete request structure
    return {
      request: {
        data: {
          nodesModified: {},
          hierarchy: hierarchy
        }
      }
    }
  }

  buildSectionHierarchyRequest(sectionData: any, sectionIdentifier?: string): any {
    // Use provided sectionIdentifier or generate a new UUID
    const sectionId = sectionIdentifier || this.generateUUID()
    const isNewSection = !sectionIdentifier

    // Get current assessment hierarchy
    const currentHierarchy = this.getAssessmentHierarchyData()

    // Build nodes modified
    const nodesModified: any = {}
    nodesModified[sectionId] = {
      isNew: isNewSection,
      root: false,
      objectType: 'QuestionSet',
      metadata: {
        maxQuestions: sectionData.maxQuestions || currentHierarchy.totalQuestions,
        mimeType: 'application/vnd.sunbird.questionset',
        minimumPassPercentage: sectionData.minPassPercentage || 0,
        name: sectionData.name || 'Section A',
        primaryCategory: currentHierarchy?.primaryCategory || NsAssessment.EAssessmentPrimaryCategory.PRACTICE_QUESTION_SET,
        totalQuestions: sectionData.totalQuestions || currentHierarchy.totalQuestions,
        compatibilityLevel: currentHierarchy?.compatibilityLevel,
        additionalInstructions: sectionData.additionalInstructions || '',
        sectionType: 'section',
        expectedDuration: sectionData.expectedDuration || currentHierarchy.expectedDuration,
      }
    }

    // If parentChanges exist, add root node update
    if (sectionData.parentChanges && currentHierarchy && currentHierarchy.identifier) {
      const rootId = currentHierarchy.identifier
      nodesModified[rootId] = {
        isNew: false,
        root: true,
        metadata: sectionData.parentChanges,
        objectType: 'QuestionSet'
      }
    }

    // Build hierarchy structure
    const hierarchy: any = {}

    // Add root assessment node
    if (currentHierarchy && currentHierarchy.identifier) {
      const rootId = currentHierarchy.identifier
      let rootChildren = currentHierarchy.children?.map((child: any) => child.identifier) || []

      // Add the new section to root children only if it's a new section
      if (isNewSection && !rootChildren.includes(sectionId)) {
        rootChildren = [...rootChildren, sectionId]
      }

      hierarchy[rootId] = {
        name: currentHierarchy.name,
        root: true,
        children: rootChildren
      }

      // Add all existing section nodes with their children
      if (currentHierarchy.children && currentHierarchy.children.length > 0) {
        currentHierarchy.children.forEach((section: any) => {
          hierarchy[section.identifier] = {
            children: section.children?.map((child: any) => child.identifier) || []
          }
        })
      }

      // Add the section node with empty children (for new sections or update existing)
      if (isNewSection) {
        hierarchy[sectionId] = {
          children: []
        }
      }
    }

    // Build the complete request structure
    return {
      request: {
        data: {
          nodesModified: nodesModified,
          hierarchy: hierarchy
        }
      }
    }
  }

  getReadOnly() {
    return this.readOnly
  }

  setReadOnly(readOnly: boolean) {
    this.readOnly = readOnly
  }
}