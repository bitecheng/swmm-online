import {Project, Point, Node} from "../swmm_model/types";
import createPoint from "../swmm_model/point";
import divider from "../swmm_model/divider";

class GraphHelper {
  private project: Project;
  private leftBottom: Point = createPoint(0, 0);
  private rightTop: Point = createPoint(0, 0);
  private width: number = 0;
  private height: number = 0;
  private canvasWidth: number = 900;
  private canvasHeight: number = 600;
  private canvasXOffset: number = 0;
  private canvasYOffset: number = 0;

  constructor(project: Project) {
    this.project = project;
    this.calculateBoundingBox = this.calculateBoundingBox.bind(this);
    this.getPointOnCanvas = this.getPointOnCanvas.bind(this);
    this.calculateBoundingBox();
  }

  public getPointOnCanvas(point: Point): Point {
    const x = (point.x - this.leftBottom.x) / this.width * this.canvasWidth + this.canvasXOffset;
    let y = (point.y - this.leftBottom.y) / this.height * this.canvasHeight + this.canvasYOffset;
    y = 600 - y;
    return createPoint(x, y);
  }

  private calculateBoundingBox(): void {
    const junctions: Node[] = this.project.junctions || [];
    const outfalls: Node[] = this.project.outfalls || [];
    const dividers: Node[] = this.project.dividers || [];
    const nodes = junctions.concat(outfalls).concat(dividers);

    const xArray: number[] = nodes.map(j => j.position.x);
    let minX: number = Math.min(...xArray);
    let maxX: number = Math.max(...xArray);
    const width = maxX - minX;
    minX = minX - width * 0.05;
    maxX = maxX + width * 0.05;

    const yArray: number[] = nodes.map(j => j.position.y);
    let minY: number = Math.min(...yArray);
    let maxY: number = Math.max(...yArray);
    const height = maxY - minY;
    minY = minY - height * 0.05;
    maxY = maxY + height * 0.05; 

    this.leftBottom = createPoint(minX, minY);
    this.rightTop = createPoint(maxX, maxY);
    this.width = maxX - minX;
    this.height = maxY - minY;

    if (width / height > 9 / 6) {
      // we do not need to change canvasWidth
      // but we need to change canvasHeight, canvasYOffset
      this.canvasHeight = this.canvasWidth / this.width * this.height;
      this.canvasYOffset = (600 - this.canvasHeight) / 2;
    } else {
      // we do not need to change canvasHeight
      // but we need to change canvasWidth, canvasXOffset
      this.canvasWidth = this.canvasHeight / this.height * this.width;
      this.canvasXOffset = (900 - this.canvasWidth) / 2;
    }
  }
}

export default GraphHelper;
