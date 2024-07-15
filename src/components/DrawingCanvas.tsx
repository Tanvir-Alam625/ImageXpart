import { KonvaEventObject } from 'konva/lib/Node';
import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Circle, Line, Transformer, Text } from 'react-konva';
import IconButton from '@material-ui/core/IconButton';
import { LineStyle, CropSquare, FiberManualRecord, Undo, Redo, GetApp } from '@material-ui/icons';
import theme from '@/theme';
import { OutlinedInput, Stack } from '@mui/material';

const DrawingCanvas: React.FC = () => {
    const [shapes, setShapes] = useState<any[]>([]);
    const [drawing, setDrawing] = useState(false);
    const [tool, setTool] = useState('line');
    const [color, setColor] = useState('#000000');
    const [lineWidth, setLineWidth] = useState(2);
    const [isClient, setIsClient] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const [currentStep, setCurrentStep] = useState<number>(-1);
    const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        if (currentStep < history.length - 1) {
            setHistory(history.slice(0, currentStep + 1));
        }
        const pos = (e.target as any).getStage().getPointerPosition();
        setDrawing(true);
        setShapes([...shapes, { tool, points: [pos.x, pos.y], color, lineWidth }]);
    };

    const handleMouseMove = (evt: KonvaEventObject<MouseEvent>) => {
        if (!drawing) return;

        const stage = evt.target.getStage();
        if (!stage) return;

        const point = stage.getPointerPosition();
        if (!point) return;

        let lastShape = shapes[shapes.length - 1];
        if (lastShape && lastShape.points) {
            lastShape.points = lastShape.points.concat([point.x, point.y]);
            shapes.splice(shapes.length - 1, 1, lastShape);
            setShapes([...shapes]);
        }
    };

    const handleMouseUp = () => {
        setDrawing(false);
        setHistory([...history, shapes]);
        setCurrentStep(currentStep + 1);
    };

    const handleUndo = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            setShapes(history[currentStep - 1]);
        }
    };

    const handleRedo = () => {
        if (currentStep < history.length - 1) {
            setCurrentStep(currentStep + 1);
            setShapes(history[currentStep + 1]);
        }
    };

    const stageRef = useRef<any>(null);
    const transformerRef = useRef<any>(null);

    const handleDownload = () => {
        if (stageRef.current) {
            const dataURL = stageRef.current.toDataURL({ mimeType: 'image/png' });
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = 'canvas.png';
            link.click();
        }
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setColor(e.target.value);
    };

    const handleLineWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLineWidth(Number(e.target.value));
    };

    const handleShapeDragStart = (e: KonvaEventObject<DragEvent>) => {
        setSelectedShapeId(e.target.id());
    };

    const handleShapeDragEnd = () => {
        setSelectedShapeId(null);
    };

    const calculateShapeDimensions = (shape: any) => {
        if (shape.tool === 'line') {
            const [x1, y1, x2, y2] = shape.points;
            const width = Math.abs(x2 - x1);
            const height = Math.abs(y2 - y1);
            return { width, height };
        } else if (shape.tool === 'rect') {
            const [x, y] = shape.points;
            const width = 100;
            const height = 100;
            return { width, height };
        } else if (shape.tool === 'circle') {
            const [x, y] = shape.points;
            const radius = 50;
            const diameter = radius * 2;
            return { width: diameter, height: diameter };
        }
        return { width: 0, height: 0 };
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newText = e.target.value;
        const selectedShape = shapes.find((shape) => shape.id === selectedShapeId);
        if (selectedShape && selectedShape.tool === 'text') {
            selectedShape.text = newText;
            setShapes([...shapes]);
        }
    };

    const handleTextBlur = () => {
        setSelectedShapeId(null);
    };

    const handleTextClick = (e: KonvaEventObject<MouseEvent>) => {
        const shapeId = e.target.id();
        setSelectedShapeId(shapeId);
    };

    return (
        <div style={{ width: '100%' }}>
            <div
                style={{
                    marginBottom: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    padding: '5px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '10px',
                    gridArea: 'tools',
                    backgroundColor: theme.palette.background.default,
                }}
            >
                <Stack
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px',
                    }}
                >
                    <IconButton onClick={handleUndo}>
                        <Undo />
                    </IconButton>
                    <IconButton onClick={handleRedo}>
                        <Redo />
                    </IconButton>
                </Stack>
                <Stack
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px',
                    }}
                >
                    <IconButton onClick={() => setTool('line')}>
                        <LineStyle color={tool === 'line' ? 'primary' : 'secondary'} />
                    </IconButton>
                    <IconButton onClick={() => setTool('rect')}>
                        <CropSquare color={tool === 'rect' ? 'primary' : 'secondary'} />
                    </IconButton>
                    <IconButton onClick={() => setTool('circle')}>
                        <FiberManualRecord color={tool === 'circle' ? 'primary' : 'secondary'} />
                    </IconButton>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                        }}
                    >
                        <OutlinedInput
                            sx={{
                                cursor: 'pointer',
                                width: '50px',
                            }}
                            type="color"
                            value={color}
                            onChange={handleColorChange}
                        />
                        <OutlinedInput
                            sx={{
                                cursor: 'pointer',
                                width: '70px',
                            }}
                            type="number"
                            value={lineWidth}
                            onChange={handleLineWidthChange}
                        />
                    </div>
                </Stack>
                <IconButton onClick={handleDownload}>
                    <GetApp />
                </IconButton>
            </div>

            <Stage
                id="canvas-stage"
                ref={stageRef}
                width={1100}
                height={500}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    backdropFilter: 'blur(10px)',
                    backgroundColor: theme.palette.background.default,
                    cursor: tool === 'line' ? 'crosshair' : 'default',
                }}
            >
                <Layer>
                    {shapes.map((shape, i) => {
                        const dimensions = calculateShapeDimensions(shape);
                        return (
                            <React.Fragment key={i}>
                                {shape.tool === 'line' && (
                                    <>
                                        <Line
                                            points={shape.points}
                                            stroke={shape.color}
                                            strokeWidth={shape.lineWidth}
                                            draggable
                                            onDragStart={handleShapeDragStart}
                                            onDragEnd={handleShapeDragEnd}
                                        />
                                        <Text
                                            x={shape.points[0]}
                                            y={shape.points[1]}
                                            text={`${dimensions.width.toFixed(2)} x ${dimensions.height.toFixed(2)}`}
                                            fontSize={12}
                                            fill={shape.color}
                                        />
                                    </>
                                )}
                                {shape.tool === 'rect' && (
                                    <>
                                        <Rect
                                            x={shape.points[0]}
                                            y={shape.points[1]}
                                            width={dimensions.width}
                                            height={dimensions.height}
                                            fill={shape.color}
                                            draggable
                                            onDragStart={handleShapeDragStart}
                                            onDragEnd={handleShapeDragEnd}
                                            onTransformEnd={() => {
                                                const node = transformerRef.current;
                                                if (node) {
                                                    const scaleX = node.scaleX();
                                                    const scaleY = node.scaleY();
                                                    const width = Math.max(5, shape.width * scaleX);
                                                    const height = Math.max(shape.height * scaleY);
                                                    const newShapes = shapes.slice();
                                                    newShapes[i] = {
                                                        ...shape,
                                                        width,
                                                        height,
                                                    };
                                                    setShapes(newShapes);
                                                }
                                            }}
                                        />
                                        <Text
                                            x={shape.points[0]}
                                            y={shape.points[1]}
                                            text={`${dimensions.width.toFixed(2)} x ${dimensions.height.toFixed(2)}`}
                                            fontSize={12}
                                            fill={shape.color}
                                        />
                                    </>
                                )}
                                {shape.tool === 'circle' && (
                                    <>
                                        <Circle
                                            x={shape.points[0]}
                                            y={shape.points[1]}
                                            radius={dimensions.width / 2}
                                            fill={shape.color}
                                            draggable
                                            onDragStart={handleShapeDragStart}
                                            onDragEnd={handleShapeDragEnd}
                                            onTransformEnd={() => {
                                                const node = transformerRef.current;
                                                if (node) {
                                                    const scaleX = node.scaleX();
                                                    const scaleY = node.scaleY();
                                                    const radius = Math.max(shape.radius * scaleX, 5);
                                                    const newShapes = shapes.slice();
                                                    newShapes[i] = {
                                                        ...shape,
                                                        radius,
                                                    };
                                                    setShapes(newShapes);
                                                }
                                            }}
                                        />
                                        <Text
                                            x={shape.points[0] - dimensions.width / 2}
                                            y={shape.points[1] - dimensions.height / 2}
                                            text={`${dimensions.width.toFixed(2)} x ${dimensions.height.toFixed(2)}`}
                                            fontSize={12}
                                            fill={shape.color}
                                        />
                                    </>
                                )}
                                {shape.tool === 'text' && (
                                    <>
                                        <Text
                                            x={shape.points[0]}
                                            y={shape.points[1]}
                                            text={shape.text}
                                            fontSize={12}
                                            fill={shape.color}
                                            draggable
                                            onDragStart={handleShapeDragStart}
                                            onDragEnd={handleShapeDragEnd}
                                            onClick={handleTextClick}
                                            onBlur={handleTextBlur}
                                            onChange={handleTextChange}
                                        />
                                    </>
                                )}
                                {selectedShapeId === `line_${i}` && (
                                    <Transformer
                                        ref={transformerRef}
                                        nodes={[stageRef.current]}
                                        enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                                    />
                                )}
                                {selectedShapeId === `rect_${i}` && (
                                    <Transformer
                                        ref={transformerRef}
                                        nodes={[stageRef.current]}
                                        enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                                    />
                                )}
                                {selectedShapeId === `circle_${i}` && (
                                    <Transformer
                                        ref={transformerRef}
                                        nodes={[stageRef.current]}
                                        enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                                    />
                                )}
                                {selectedShapeId === `text_${i}` && (
                                    <Transformer
                                        ref={transformerRef}
                                        nodes={[stageRef.current]}
                                        enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                </Layer>
            </Stage>
        </div>
    );
};

export default DrawingCanvas;
