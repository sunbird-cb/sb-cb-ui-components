/* eslint-disable */
import { Injectable } from '@angular/core';
import { defaultConfig } from '../constants/app-constant';
import * as d3 from 'd3';

interface ConnectedDot {
  target: any;
  line: any;
}

interface D3Line {
  source: any;
  target: any;
  path: any;
  svg: any;
  position: () => void;
  show: (animation?: string) => void;
  remove: () => void;
}

@Injectable()
export class ConnectorService {
  connectorMap: {[key: string]: any} = {};
  elmWrapper: any;
  containerSelector = '#treeViewContainer'; // You might need to adjust this selector

  constructor() {
  }

  _drawLine(source: any, target: any, options: any = defaultConfig, sourceContainerId: any = undefined, targetContainerId: any = undefined): any {
    const _options = <any>{...defaultConfig, ...options};
    _options['dashed'] = true
    if (Array.isArray(target)) {
      let connectedDots: ConnectedDot[] = [];
      target.forEach((_target) => {
        const tempLine = this.renderLine(source, _target, _options);
        connectedDots.push({
          target: _target,
          line: tempLine
        });
        
        if(sourceContainerId) {
          const sourceContainer = document.querySelector(sourceContainerId);
          if (sourceContainer) {
            sourceContainer.addEventListener('scroll', () => {
              try {
                tempLine && tempLine.position();
              } catch(e) {
                // Error handling
              }
            }, true);
          }
        }
        
        if (targetContainerId) {
          const targetContainer = document.querySelector(targetContainerId);
          if (targetContainer) {
            targetContainer.addEventListener('scroll', () => {
              try {
                tempLine && tempLine.position();
              } catch(e) {
                // Error handling
              }
            }, true);
          }
        }
      });
      return connectedDots;
    } else {
      return this.renderLine(source, target, _options);
    }
  }

  private renderLine(source: any, target: any, options: any): D3Line {
    // Find or create the container element
    const treeViewComponent: any = document.querySelector(this.containerSelector);
    if (!treeViewComponent) {
      return {
        source: null,
        target: null,
        path: null,
        svg: null,
        position: () => {},
        show: () => {},
        remove: () => {}
      };
    }
    
    // Create or get container for the SVG
    let container: any = treeViewComponent.querySelector('#leader-line-container');
    if (!container) {
      // Create a wrapper container to control the overflow at the top
      let overflowWrapper = document.createElement('div');
      overflowWrapper.id = 'leader-line-overflow-wrapper';
      overflowWrapper.style.position = 'absolute';
      overflowWrapper.style.top = '80px'; // Same top position
      overflowWrapper.style.bottom = '0';
      overflowWrapper.style.left = '0';
      overflowWrapper.style.right = '0';
      overflowWrapper.style.overflow = 'hidden'; // Hide anything above this container
      overflowWrapper.style.pointerEvents = 'none'; // Allow clicks to pass through
      
      // Original container remains the same but positioned at top:0 within the wrapper
      container = document.createElement('div');
      container.id = 'leader-line-container';
      container.style.position = 'absolute';
      container.style.top = '0'; // Changed to 0 as it's now relative to wrapper
      container.style.bottom = '0';
      container.style.left = '0';
      container.style.right = '0';
      container.style.width = '100%';
      container.style.height = '100%';
      
      // Add resize observer to dynamically adjust container width
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          if (entry.target === treeViewComponent) {
            container.style.width = `${entry.contentRect.width}px`;
            
            // Reposition all lines when container resizes
            if (this.connectorMap) {
              Object.values(this.connectorMap).forEach((connector: any) => {
                if (connector && connector.lines) {
                  connector.lines.forEach((item: any) => {
                    if (item.line && typeof item.line.position === 'function') {
                      item.line.position();
                    }
                  });
                }
              });
            }
          }
        }
      });
      
      // Start observing the treeViewComponent
      resizeObserver.observe(treeViewComponent);
      
      // Also listen for scroll events to reposition lines
      treeViewComponent.addEventListener('scroll', () => {
        // Update container dimensions based on visible area
        overflowWrapper.style.width = `${treeViewComponent.scrollWidth}px`;
        overflowWrapper.style.height = `${treeViewComponent.scrollHeight}px`;
        
        // Reposition all active lines
        this.repositionAllLines();
      });
      
      overflowWrapper.appendChild(container);
      treeViewComponent.appendChild(overflowWrapper);
    }
    
    // Store container reference for access in other methods
    this.elmWrapper = container;
    
    // Get the source and target elements
    let sourceElement = source;
    let targetElement: any;
    
    if (target.targetType === 'id') {
      targetElement = document.getElementById(target.target);
    } else {
      targetElement = target.target;
    }
    
    // Ensure both elements exist
    if (!sourceElement || !targetElement) {
      return {
        source: null,
        target: null,
        path: null,
        svg: null,
        position: () => {},
        show: () => {},
        remove: () => {}
      };
    }
    
    // Create a unique ID for the SVG
    const svgId = 'd3-line-' + Math.random().toString(36).substr(2, 9);
    
    // Create SVG element
    const svg = d3.select(container)
      .append('svg')
      .attr('id', svgId)
      .attr('class', 'leader-line')
      .style('position', 'absolute')
      .style('top', '0')
      .style('left', '0')
      .style('width', '100%')
      .style('height', '100%')
      .style('pointer-events', 'none')
      .style('overflow', 'visible');
    
    // Calculate positions
    const sourceRect = sourceElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // Determine edge connection points - always right to left
    let sourceX, sourceY, targetX, targetY;

    // Source - always connect from the right edge
    sourceX = sourceRect.right - containerRect.left;
    sourceY = sourceRect.top + (sourceRect.height / 2) - containerRect.top;

    // Target - always connect to the left edge
    targetX = targetRect.left - containerRect.left;
    targetY = targetRect.top + (targetRect.height / 2) - containerRect.top;
    
    // Create line with initial opacity 1 (visible immediately)
    // Instead of a straight line, create a grid line with right angles
    const path: any = svg.append('path')
      .attr('d', createGridPath(sourceX, sourceY, targetX, targetY))
      .style('stroke', '#000') // Darker color for better visibility
      .style('stroke-width', options.size || 2)
      .style('fill', 'none')
      .style('opacity', 1) // Start visible
      .style('stroke-linejoin', 'round') // Round corners for a smoother look
      .style('stroke-dasharray', options.dashed ? '5,5' : 'none'); // Add dashed style if specified
    
    // Helper function to create a grid path
    function createGridPath(x1: number, y1: number, x2: number, y2: number) {
      // Calculate the midpoint on the x-axis
      const midX = x1 + (x2 - x1) / 2;
      
      // Create a path with 3 segments (horizontal, vertical, horizontal)
      return `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
    }
  
    // Define markers (disk at start and arrow at end)
    const defs = svg.append('defs');
    
    // Add start marker (disk/circle)
    if (options.startPlug === 'disc' || options.startPlug !== false) {
      defs.append('marker')
        .attr('id', `start-circle-${svgId}`)
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 5)
        .attr('refY', 5)
        .attr('markerWidth', 8)
        .attr('markerHeight', 8)
        .attr('orient', 'auto')
        .append('circle')
        .attr('cx', 5)
        .attr('cy', 5)
        .attr('r', 4.5)
        .style('fill', options.color || '#333');
      
      path.attr('marker-start', `url(#start-circle-${svgId})`);
    }
    
    // Add end marker (arrow)
    if (options.endPlug === 'arrow' || options.endPlug !== false) {
      defs.append('marker')
        .attr('id', `arrowhead-${svgId}`)
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 8)  
        .attr('refY', 5)
        .attr('markerWidth', 9)
        .attr('markerHeight', 9)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M 0 0 L 10 5 L 0 10 z')
        .style('fill', options.color || '#333');
      
      path.attr('marker-end', `url(#arrowhead-${svgId})`);
    }
    
    // Create the D3Line object with API similar to LeaderLine
    const d3Line: D3Line = {
      source: sourceElement,
      target: targetElement,
      path: path,
      svg: svg,
      
      // Position method to update line coordinates
      position: function() {
        // Get updated positions
        const updatedSourceRect = sourceElement.getBoundingClientRect();
        const updatedTargetRect = targetElement.getBoundingClientRect();
        const updatedContainerRect = container.getBoundingClientRect();
        
        // Source - always connect from the right edge
        const updatedSourceX = updatedSourceRect.right - updatedContainerRect.left;
        const updatedSourceY = updatedSourceRect.top + (updatedSourceRect.height / 2) - updatedContainerRect.top;
        
        // Target - always connect to the left edge
        const updatedTargetX = updatedTargetRect.left - updatedContainerRect.left;
        const updatedTargetY = updatedTargetRect.top + (updatedTargetRect.height / 2) - updatedContainerRect.top;
        
        // Update path with grid path
        const midX = updatedSourceX + (updatedTargetX - updatedSourceX) / 2;
        path.attr('d', `M ${updatedSourceX} ${updatedSourceY} L ${midX} ${updatedSourceY} L ${midX} ${updatedTargetY} L ${updatedTargetX} ${updatedTargetY}`)
            .style('stroke-dasharray', options.dashed ? '5,5' : 'none')
            // Ensure markers are preserved during repositioning
            .attr('marker-start', options.startPlug !== false ? `url(#start-circle-${svgId})` : null)
            .attr('marker-end', options.endPlug !== false ? `url(#arrowhead-${svgId})` : null);
      },
      
      // Show method with animation option
      show: function(animation = '') {
        if (animation === 'draw') {
          // Ensure the path has a node before calculating total length
          const pathNode = path.node();
          if (!pathNode) return;
          
          const totalLength = pathNode.getTotalLength();
          
          path.style('opacity', 1)
            .attr('stroke-dasharray', totalLength)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .duration(options.animOptions?.duration || 2000)
            .ease(d3.easeLinear)
            .attr('stroke-dashoffset', 0);
        } else {
          path.style('opacity', 1);
        }
      },
      
      // Remove method
      remove: function() {
        svg.remove();
      }
    };
    
    // Immediately call show to make the line visible
    d3Line.show(options.animation);
    
    return d3Line;
  }

  updateConnectorsMap(map: any): void {
    this.connectorMap = map;
  }

  position(line: any): void {
    if (!line || !line.position) return;
    
    this.elmWrapper.style.transform = 'none';
    var rectWrapper = this.elmWrapper.getBoundingClientRect();
    // Move to the origin of coordinates as the document
    this.elmWrapper.style.transform = 'translate(' +
      ((rectWrapper.left + window.pageXOffset) * -1) + 'px, ' +
      ((rectWrapper.top + window.pageYOffset) * -1) + 'px)';
    
    line.position();
  }

  removeAllLines(): void {
    if(this.connectorMap) {
      for (const key in this.connectorMap) {
        // Remove all n-1 lines and keep only current selection, also clear n+1 lines
        if(this.connectorMap[key] && this.connectorMap[key].lines && this.connectorMap[key].lines.length > 0) {
          const lines = this.connectorMap[key].lines;
          lines.forEach(async (element: any, index: any) => {
              await element.line && element.line.remove();
              lines.splice(index, 1);
          });
          this.connectorMap[key].lines = lines;
        }
      }
    }
    // to reset connector map after clearing all the lines
    this.updateConnectorsMap({});
  }

  repositionAllLines(): void {
    if (this.connectorMap) {
      Object.values(this.connectorMap).forEach((connector: any) => {
        if (connector && connector.lines) {
          connector.lines.forEach((item: any) => {
            if (item.line && typeof item.line.position === 'function') {
              item.line.position();
            }
          });
        }
      });
    }
  }
}