// import {
//     ArrowsMove,
//     ArrowUpLeft,
//     ArrowUpLeftSquareFill,
//     Circle,
//     Pencil,
//     Square,
//   } from "react-bootstrap-icons";

//import { Options } from "@/Canvas.Types";
import {
  ArrowLeft,
  CallMade,
  ControlCamera,
  CropSquare,
  PanoramaFishEye,
  SquareFoot
} from '@material-ui/icons';
import { Circle, Mode } from '@mui/icons-material';

export enum DrawAction {
  Select = "select",
  Rectangle = "rectangle",
  Circle = "circle",
  Scribble = "freedraw",
  Arrow = "arrow",
  Undo = "Undo",
  Redo = "Redo",
  Clear = "Clear",
  Text = "Text",
}

export enum CanvasAction {
  Add = "add",
  Delete = "delete",
  Resize = "resize",
  Drag = "drag",
}



export const PAINT_OPTIONS = [
  {
    id: DrawAction.Select,
    label: "Select Shapes",
    icon: <ControlCamera />,
  },
  { id: DrawAction.Rectangle, label: "Draw Rectangle Shape", icon: <CropSquare /> },
  { id: DrawAction.Circle, label: "Draw Circle Shape", icon: <PanoramaFishEye /> },
  { id: DrawAction.Arrow, label: "Draw Arrow Shape", icon: <CallMade /> },
  { id: DrawAction.Scribble, label: "Scribble", icon: <Mode /> },
];
