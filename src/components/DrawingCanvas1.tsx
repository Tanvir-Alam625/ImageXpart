import { KonvaEventObject } from "konva/lib/Node";
import React, { useCallback, useRef, useState } from "react";
import {
  Stage,
  Layer,
  Rect as KonvaRect,
  Image as KonvaImage,
  Circle as KonvaCircle,
  Line as KonvaLine,
  Arrow as KonvaArrow,
  Transformer,
} from "react-konva";

import { v4 as uuidv4 } from "uuid";
import { Arrow, Circle, Rectangle, Scribble } from "@/config/Canvas.Types";
import { CanvasAction, DrawAction, PAINT_OPTIONS } from "@/config/Canvas.constant";
import InputColor from 'react-input-color';
import {
  CloudUpload, CloudDownload,
  Undo, Redo,
  Close
} from '@material-ui/icons';
import { Button, ButtonGroup, IconButton, Stack } from "@mui/material";
import { alpha } from "@material-ui/core";
import theme from "@/theme";


interface DrawingCanvas1Props { }

const downloadURI = (uri: string | undefined, name: string) => {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri || "";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const SIZE = 450;
const WIDTH = 900;


export const DrawingCanvas1: React.FC<DrawingCanvas1Props> = React.memo(function DrawingCanvas1({ }) {
  const [color, setColor] = useState(theme.palette.primary.main);
  const [drawAction, setDrawAction] = useState<DrawAction>(DrawAction.Select);
  const [scribbles, setScribbles] = useState<Scribble[]>([]);
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [image, setImage] = useState<HTMLImageElement>();
  const [canvasHistory, setCanvasHistory] = useState<any[]>([]);
  const [canvasFuture, setCanvasFuture] = useState<any[]>([]);
  const [texts, setTexts] = useState<any[]>([]);
  const onImportImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        const imageUrl = URL.createObjectURL(e.target.files?.[0]);
        const image = new Image(SIZE / 2, SIZE / 2);
        image.src = imageUrl;
        setImage(image);
      }
      e.target.files = null;
    },
    []
  );

  const fileRef = useRef<HTMLInputElement>(null);
  const onImportImageClick = useCallback(() => {
    fileRef?.current && fileRef?.current?.click();
  }, []);

  const stageRef = useRef<any>(null);

  const onExportClick = useCallback(() => {
    const dataUri = stageRef?.current?.toDataURL({ pixelRatio: 3 });
    downloadURI(dataUri, "image.png");
  }, []);

  const onClear = useCallback(() => {
    setRectangles([]);
    setCircles([]);
    setScribbles([]);
    setArrows([]);
    setImage(undefined);
  }, []);

  const isPaintRef = useRef(false);

  const onStageMouseUp = useCallback(() => {
    isPaintRef.current = false;
  }, []);

  const currentShapeRef = useRef<string>();

  const settingCanvasHistory = (type: CanvasAction, drawAction: DrawAction, record: any) => {
    setCanvasHistory((prevCanvasHistory) => [
      ...prevCanvasHistory,
      {
        type,
        drawAction,
        payload: { record },
      },
    ]);
    setCanvasFuture([]);
  }

  const onStageMouseDown = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (drawAction === DrawAction.Select) return;
      isPaintRef.current = true;
      const stage = stageRef?.current;
      const pos = stage?.getPointerPosition();
      const x = pos?.x || 0;
      const y = pos?.y || 0;
      const id = uuidv4();
      currentShapeRef.current = id;

      switch (drawAction) {
        case DrawAction.Scribble: {
          setScribbles((prevScribbles) => [
            ...prevScribbles,
            {
              id,
              points: [x, y],
              color,
            },
          ]);
          settingCanvasHistory(CanvasAction.Add, drawAction, { id, points: [x, y], color });
          break;
        }
        case DrawAction.Circle: {
          setCircles((prevCircles) => [
            ...prevCircles,
            {
              id,
              radius: 1,
              x,
              y,
              color,
            },
          ]);
          settingCanvasHistory(CanvasAction.Add, drawAction, { id, radius: 1, x, y, color });
          break;
        }
        case DrawAction.Rectangle: {
          setRectangles((prevRectangles) => [
            ...prevRectangles,
            {
              id,
              height: 1,
              width: 1,
              x,
              y,
              color,
            },
          ]);
          settingCanvasHistory(CanvasAction.Add, drawAction, { id, height: 1, width: 1, x, y, color });
          break;
        }
        case DrawAction.Arrow: {
          setArrows((prevArrows) => [
            ...prevArrows,
            {
              id,
              points: [x, y, x, y],
              color,
            },
          ]);
          settingCanvasHistory(CanvasAction.Add, drawAction, { id, points: [x, y, x, y], color });
          break;
        }
      }
    },
    [drawAction, color]
  );

  const onStageMouseMove = useCallback(() => {
    if (drawAction === DrawAction.Select || !isPaintRef.current) return;

    const stage = stageRef?.current;
    const id = currentShapeRef.current;
    const pos = stage?.getPointerPosition();
    const x = pos?.x || 0;
    const y = pos?.y || 0;

    switch (drawAction) {
      case DrawAction.Scribble: {
        setScribbles((prevScribbles) =>
          prevScribbles?.map((prevScribble) =>
            prevScribble.id === id
              ? {
                ...prevScribble,
                points: [...prevScribble.points, x, y],
              }
              : prevScribble
          )
        );
        break;
      }
      case DrawAction.Circle: {
        setCircles((prevCircles) =>
          prevCircles?.map((prevCircle) =>
            prevCircle.id === id
              ? {
                ...prevCircle,
                radius:
                  ((x - prevCircle.x) ** 2 + (y - prevCircle.y) ** 2) ** 0.5,
              }
              : prevCircle
          )
        );
        break;
      }
      case DrawAction.Rectangle: {
        setRectangles((prevRectangles) =>
          prevRectangles?.map((prevRectangle) =>
            prevRectangle.id === id
              ? {
                ...prevRectangle,
                height: y - prevRectangle.y,
                width: x - prevRectangle.x,
              }
              : prevRectangle
          )
        );
        break;
      }
      case DrawAction.Arrow: {
        setArrows((prevArrows) =>
          prevArrows.map((prevArrow) =>
            prevArrow.id === id
              ? {
                ...prevArrow,
                points: [prevArrow.points[0], prevArrow.points[1], x, y],
              }
              : prevArrow
          )
        );
        break;
      }
    }
  }, [drawAction]);

  const transformerRef = useRef<any>(null);

  const onShapeClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (drawAction !== DrawAction.Select) return;
      const currentTarget = e.currentTarget;
      transformerRef?.current?.node(currentTarget);
    },
    [drawAction]
  );

  const isDraggable = drawAction === DrawAction.Select;

  const onBgClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      transformerRef?.current?.nodes([]);
    },
    [drawAction]
  );

  const getSetterByType = useCallback((type: DrawAction | undefined) => {
    let setter: React.Dispatch<React.SetStateAction<any[]>> | undefined;
    switch (type) {
      case DrawAction.Rectangle:
        setter = setRectangles;
        break;
      case DrawAction.Circle:
        setter = setCircles;
        break;
      case DrawAction.Arrow:
        setter = setArrows;
        break;
      case DrawAction.Scribble:
        setter = setScribbles;
        break;
      case DrawAction.Text:
        setter = setTexts;
        break;
    }
    return setter;
  }, []);

  const getRecordsByType = useCallback(
    (type: DrawAction | undefined) => {
      let records: any[] | undefined;
      switch (type) {
        case DrawAction.Rectangle:
          records = rectangles;
          break;
        case DrawAction.Circle:
          records = circles;
          break;
        case DrawAction.Arrow:
          records = arrows;
          break;
        case DrawAction.Scribble:
          records = scribbles;
          break;
        case DrawAction.Text:
          records = texts;
          break;
      }
      return records;
    },
    [arrows, circles, rectangles, scribbles]
  );

  const onTransformShapeStart = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      setCanvasHistory((prevCanvasHistory) => [
        ...prevCanvasHistory,
        {
          type: CanvasAction.Resize,
          drawAction: e.target.attrs.name,
          payload: {
            id: e.target.attrs.id,
            scaleX: e.target.attrs.scaleX,
            scaleY: e.target.attrs.scaleY,
          },
        },
      ]);
    },
    []
  );

  const onDragShapeStart = useCallback((e: KonvaEventObject<MouseEvent>) => {
    setCanvasHistory((prevCanvasHistory) => [
      ...prevCanvasHistory,
      {
        type: CanvasAction.Drag,
        drawAction: e.target.attrs.name,
        payload: {
          id: e.target.attrs.id,
          x: e.target.attrs.x,
          y: e.target.attrs.y,
        },
      },
    ]);
  }, []);




  const onUndoClick = useCallback(() => {
    const canvasHistoryPayload = [...canvasHistory];
    const lastAction = canvasHistoryPayload.pop();// remove last action
    setCanvasHistory(canvasHistoryPayload);
    const findLastAction = canvasHistoryPayload[canvasHistoryPayload.length - 1];
    setCanvasFuture((prevCanvasFuture) => [...prevCanvasFuture, findLastAction]);

    if (lastAction) {
      const setter = getSetterByType(lastAction.drawAction);
      getRecordsByType(lastAction.drawAction);

      if (setter) {
        switch (lastAction.type) {
          case CanvasAction.Add:
            setter((prevRecords) =>
              prevRecords.filter(
                (record) => record.id !== lastAction.payload.record.id
              )
            );
            break;
          case CanvasAction.Resize:
            setter((prevRecords) =>
              prevRecords.map((record) =>
                record.id === lastAction.payload.id
                  ? {
                    ...record,
                    scaleX: lastAction.payload.scaleX,
                    scaleY: lastAction.payload.scaleY,
                  }
                  : record
              )
            );
            break;
          case CanvasAction.Drag:
            setter((prevRecords) =>
              prevRecords.map((record) =>
                record.id === lastAction.payload.id
                  ? {
                    ...record,
                    x: lastAction.payload.x,
                    y: lastAction.payload.y,
                  }
                  : record
              )
            );
            break;
        }
      }
    }
  }, [canvasHistory, getSetterByType]);



  const onRedoClick = useCallback(() => {
    const findFutureAction = canvasFuture[canvasFuture.length - 1];

    if (!findFutureAction) return;

    setCanvasHistory((prevCanvasHistory) => [...prevCanvasHistory, findFutureAction]);
    setCanvasFuture((prevCanvasFuture) => prevCanvasFuture.slice(0, -1));

    const setter = getSetterByType(findFutureAction.drawAction);
    const records = getRecordsByType(findFutureAction.drawAction);

    if (setter && records) {
      switch (findFutureAction.type) {
        case CanvasAction.Add:
          setter((prevRecords) => [...prevRecords, findFutureAction.payload.record]);
          break;
        case CanvasAction.Resize:
          setter((prevRecords) =>
            prevRecords.map((record) =>
              record.id === findFutureAction.payload.id
                ? { ...record, scaleX: findFutureAction.payload.scaleX, scaleY: findFutureAction.payload.scaleY }
                : record
            )
          );
          break;
        case CanvasAction.Drag:
          setter((prevRecords) =>
            prevRecords.map((record) =>
              record.id === findFutureAction.payload.id
                ? { ...record, x: findFutureAction.payload.x, y: findFutureAction.payload.y }
                : record
            )
          );
          break;
      }
    }
  }, [canvasFuture, setCanvasHistory, setCanvasFuture, getSetterByType, getRecordsByType]);


  return (
    <Stack m={1} width={`${WIDTH}px`}
      sx={{
        mx: "auto",
      }}
    >
      <Stack sx={{
        display: "flex",
        justifyContent: "space-between",
      }}>
        <ButtonGroup
          sx={{
            backgroundColor: "white",
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
          }}
        >

          <div style={{ display: 'flex', justifyContent: 'start', gap: '10px' }}>
            {PAINT_OPTIONS.map(({ id, label, icon }) => (
              <IconButton
                title={label}
                sx={{
                  backgroundColor: drawAction === id ? "primary.main" : "white",
                  color: drawAction === id ? "white" : "primary.main",
                  height: "40px",
                  width: "40px",
                  "&:hover": { backgroundColor: "primary.main", color: "white" },
                }}
                key={id}
                aria-label={label}
                onClick={() => setDrawAction(id)}

              >
                {icon}
              </IconButton>
            ))}


            <input
              type="file"
              ref={fileRef}
              onChange={onImportImageSelect}
              style={{ display: "none" }}
              accept="image/*"
            />
            <IconButton
              title="Undo"
              sx={{
                backgroundColor: "white",
                color: "primary.main",
                height: "40px",
                width: "40px",
                "&:hover": { backgroundColor: "primary.main", color: "white" },
              }}
              aria-label={"Undo"} onClick={onUndoClick} ><Undo /></IconButton>
            <IconButton
              title="Redo"
              sx={{
                backgroundColor: "white",
                color: "primary.main",
                height: "40px",
                width: "40px",
                "&:hover": { backgroundColor: "primary.main", color: "white" },
              }}
              aria-label={"Redo"} onClick={onRedoClick} ><Redo /></IconButton>
            <IconButton
              title="Clear"
              sx={{
                backgroundColor: "white",
                color: "primary.main",
                height: "40px",
                width: "40px",
                "&:hover": { backgroundColor: "primary.main", color: "white" },
              }}
              aria-label={"Clear"} onClick={onClear} >
              <Close />
            </IconButton>

          </div>
          <div style={{ display: 'flex', justifyContent: 'end', gap: '10px' }}>
            <InputColor
              initialValue={color}
              onChange={(color: { hex: string }) => setColor(color.hex)}
              title="Pick a color"
              style={{
                width: '50px',
                height: '40px',
                padding: "10px",
                border: '2px solid ' + `${alpha(color, 0.5)}`,
                borderRadius: '5px',
              }}
              placement="bottom-center"
            />
            <Button variant="outlined" aria-label={"Upload"} onClick={onImportImageClick} ><CloudUpload style={{ marginRight: '10px' }} />  Import </Button>
            <Button variant="outlined" aria-label={"Download"} onClick={onExportClick} ><CloudDownload style={{ marginRight: '10px' }} />  Export </Button>
          </div>
        </ButtonGroup>
      </Stack>

      <Stack
        width={`${WIDTH}px`}
        height={`${SIZE}px`}
        sx={{
          borderRadius: "5px",
          mx: "auto",
        }}
        mt={1}
        overflow="hidden"
      >
        <Stage
          height={SIZE}
          width={WIDTH}
          ref={stageRef}
          onMouseUp={onStageMouseUp}
          onMouseDown={onStageMouseDown}
          onMouseMove={onStageMouseMove}
        >
          <Layer

          >
            <KonvaRect
              x={0}
              y={0}
              height={SIZE}
              width={WIDTH}
              fill="white"
              dragBoundFunc={(pos) => {
                return {
                  x: pos.x < 0 ? 0 : pos.x,
                  y: pos.y < 0 ? 0 : pos.y,
                };
              }}
              id="bg"
              onClick={onBgClick}
            />
            {image && (
              <KonvaImage
                image={image}
                x={0}
                y={0}
                height={SIZE / 2}
                width={SIZE / 2}
                draggable={isDraggable}
              />
            )}
            {arrows.map((arrow) => (
              <KonvaArrow
                key={arrow.id}
                id={arrow.id}
                points={arrow.points}
                fill={arrow.color}
                stroke={arrow.color}
                strokeWidth={4}
                onClick={onShapeClick}
                draggable={isDraggable}
              />
            ))}
            {rectangles.map((rectangle) => (
              <KonvaRect
                key={rectangle.id}
                x={rectangle?.x}
                y={rectangle?.y}
                height={rectangle?.height}
                width={rectangle?.width}
                stroke={rectangle?.color}
                id={rectangle?.id}
                strokeWidth={4}
                onClick={onShapeClick}
                draggable={isDraggable}
              />
            ))}
            {circles.map((circle) => (
              <KonvaCircle
                key={circle.id}
                id={circle.id}
                x={circle?.x}
                y={circle?.y}
                radius={circle?.radius}
                stroke={circle?.color}
                strokeWidth={4}
                onClick={onShapeClick}
                draggable={isDraggable}
              />
            ))}
            {scribbles.map((scribble) => (
              <KonvaLine
                key={scribble.id}
                id={scribble.id}
                lineCap="round"
                lineJoin="round"
                stroke={scribble?.color}
                strokeWidth={4}
                points={scribble.points}
                onClick={onShapeClick}
                draggable={isDraggable}
              />
            ))}
            <Transformer ref={transformerRef}
              onTransformStart={onTransformShapeStart}
              onDragStart={onDragShapeStart}
            />
          </Layer>
        </Stage>
      </Stack>
    </Stack>
  );
});
