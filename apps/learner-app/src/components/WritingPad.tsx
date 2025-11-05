import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pen, Eraser, Type, Palette, Save, Download, 
  Trash2, Undo, Redo, Circle, Square, 
  ArrowRight, Minus, RotateCcw, Image as ImageIcon,
  Layers, Eye, EyeOff, Lock, Unlock, 
  Grid, Maximize2, Minimize2, Settings
} from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';

interface WritingPadProps {
  onClose: () => void;
  childName: string;
  isFullscreen?: boolean;
  initialContent?: string;
}

interface DrawingLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  paths: Path[];
}

interface Path {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  width: number;
  tool: 'pen' | 'eraser' | 'highlighter';
  opacity: number;
}

interface TextElement {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
  fontFamily: string;
}

export const WritingPad: React.FC<WritingPadProps> = ({
  onClose,
  childName,
  isFullscreen = false,
  initialContent = '',
}) => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser' | 'text' | 'shapes'>('pen');
  const [currentColor, setCurrentColor] = useState('#2563eb');
  const [brushSize, setBrushSize] = useState(4);
  const [layers, setLayers] = useState<DrawingLayer[]>([
    {
      id: 'layer1',
      name: 'Drawing Layer',
      visible: true,
      locked: false,
      opacity: 1,
      paths: [],
    }
  ]);
  const [activeLayerId, setActiveLayerId] = useState('layer1');
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [currentPath, setCurrentPath] = useState<Path | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [showGrid, setShowGrid] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [showTools, setShowTools] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [savedDrawings, setSavedDrawings] = useState<any[]>([]);

  // Color palette for kids
  const colorPalette = [
    '#ef4444', '#f97316', '#eab308', '#22c55e', 
    '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
    '#64748b', '#000000', '#ffffff', '#f1f5f9'
  ];

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvasSize.width * window.devicePixelRatio;
    canvas.height = canvasSize.height * window.devicePixelRatio;
    canvas.style.width = `${canvasSize.width}px`;
    canvas.style.height = `${canvasSize.height}px`;
    
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    redrawCanvas();
  }, [canvasSize]);

  // Redraw canvas
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    
    // Draw grid if enabled
    if (showGrid) {
      drawGrid(ctx);
    }

    // Draw all layers
    layers.forEach(layer => {
      if (!layer.visible) return;
      
      ctx.globalAlpha = layer.opacity;
      
      layer.paths.forEach(path => {
        if (path.points.length < 2) return;
        
        ctx.beginPath();
        ctx.globalCompositeOperation = path.tool === 'eraser' ? 'destination-out' : 'source-over';
        ctx.strokeStyle = path.color;
        ctx.lineWidth = path.width;
        ctx.globalAlpha = path.opacity * layer.opacity;
        
        ctx.moveTo(path.points[0].x, path.points[0].y);
        for (let i = 1; i < path.points.length; i++) {
          ctx.lineTo(path.points[i].x, path.points[i].y);
        }
        ctx.stroke();
      });
    });

    // Draw text elements
    textElements.forEach(element => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = element.color;
      ctx.font = `${element.fontSize}px ${element.fontFamily}`;
      ctx.globalAlpha = 1;
      ctx.fillText(element.text, element.x, element.y);
    });

    // Draw current path
    if (currentPath && currentPath.points.length > 1) {
      ctx.beginPath();
      ctx.globalCompositeOperation = currentPath.tool === 'eraser' ? 'destination-out' : 'source-over';
      ctx.strokeStyle = currentPath.color;
      ctx.lineWidth = currentPath.width;
      ctx.globalAlpha = currentPath.opacity;
      
      ctx.moveTo(currentPath.points[0].x, currentPath.points[0].y);
      for (let i = 1; i < currentPath.points.length; i++) {
        ctx.lineTo(currentPath.points[i].x, currentPath.points[i].y);
      }
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }, [layers, textElements, currentPath, showGrid, canvasSize]);

  // Draw grid
  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    const gridSize = 20;
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;

    for (let x = 0; x <= canvasSize.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasSize.height);
      ctx.stroke();
    }

    for (let y = 0; y <= canvasSize.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasSize.width, y);
      ctx.stroke();
    }
  }, [canvasSize]);

  // Get mouse position relative to canvas
  const getMousePos = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvasSize.width / rect.width),
      y: (e.clientY - rect.top) * (canvasSize.height / rect.height),
    };
  }, [canvasSize]);

  // Start drawing
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === 'text') return;
    
    const activeLayer = layers.find(l => l.id === activeLayerId);
    if (!activeLayer || activeLayer.locked) return;

    const pos = getMousePos(e);
    
    const newPath: Path = {
      id: Date.now().toString(),
      points: [pos],
      color: currentColor,
      width: brushSize,
      tool: currentTool === 'pen' ? 'pen' : 'eraser',
      opacity: currentTool === 'eraser' ? 1 : 0.9,
    };

    setCurrentPath(newPath);
    setIsDrawing(true);
  }, [currentTool, activeLayerId, layers, getMousePos, currentColor, brushSize]);

  // Continue drawing
  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentPath) return;

    const pos = getMousePos(e);
    const updatedPath = {
      ...currentPath,
      points: [...currentPath.points, pos],
    };

    setCurrentPath(updatedPath);
    redrawCanvas();
  }, [isDrawing, currentPath, getMousePos, redrawCanvas]);

  // Stop drawing
  const stopDrawing = useCallback(() => {
    if (!isDrawing || !currentPath) return;

    // Add path to active layer
    setLayers(prevLayers => 
      prevLayers.map(layer => 
        layer.id === activeLayerId 
          ? { ...layer, paths: [...layer.paths, currentPath] }
          : layer
      )
    );

    // Save to history
    setHistory(prev => [...prev.slice(0, historyStep + 1), { layers, textElements }]);
    setHistoryStep(prev => prev + 1);

    setCurrentPath(null);
    setIsDrawing(false);
  }, [isDrawing, currentPath, activeLayerId, layers, textElements, historyStep]);

  // Add text
  const addText = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool !== 'text') return;

    const pos = getMousePos(e);
    const text = prompt('Enter text:');
    
    if (text) {
      const newTextElement: TextElement = {
        id: Date.now().toString(),
        x: pos.x,
        y: pos.y,
        text,
        fontSize: 24,
        color: currentColor,
        fontFamily: 'Arial',
      };

      setTextElements(prev => [...prev, newTextElement]);
      redrawCanvas();
    }
  }, [currentTool, getMousePos, currentColor, redrawCanvas]);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    if (confirm('Are you sure you want to clear everything?')) {
      setLayers([{
        id: 'layer1',
        name: 'Drawing Layer',
        visible: true,
        locked: false,
        opacity: 1,
        paths: [],
      }]);
      setTextElements([]);
      setActiveLayerId('layer1');
      redrawCanvas();
    }
  }, [redrawCanvas]);

  // Undo
  const undo = useCallback(() => {
    if (historyStep > 0) {
      const prevState = history[historyStep - 1];
      setLayers(prevState.layers);
      setTextElements(prevState.textElements);
      setHistoryStep(prev => prev - 1);
    }
  }, [history, historyStep]);

  // Redo
  const redo = useCallback(() => {
    if (historyStep < history.length - 1) {
      const nextState = history[historyStep + 1];
      setLayers(nextState.layers);
      setTextElements(nextState.textElements);
      setHistoryStep(prev => prev + 1);
    }
  }, [history, historyStep]);

  // Save drawing
  const saveDrawing = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const drawingData = {
      id: Date.now().toString(),
      name: `${childName}'s Drawing ${new Date().toLocaleDateString()}`,
      layers,
      textElements,
      canvasSize,
      thumbnail: canvas.toDataURL('image/jpeg', 0.3),
      created: new Date().toISOString(),
    };

    setSavedDrawings(prev => [...prev, drawingData]);
    
    // Save to localStorage
    localStorage.setItem('aivoWritingPadDrawings', JSON.stringify([...savedDrawings, drawingData]));
    
    alert('Drawing saved successfully!');
  }, [childName, layers, textElements, canvasSize, savedDrawings]);

  // Download as image
  const downloadImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `${childName}-drawing-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  }, [childName]);

  // Add layer
  const addLayer = useCallback(() => {
    const newLayer: DrawingLayer = {
      id: `layer${Date.now()}`,
      name: `Layer ${layers.length + 1}`,
      visible: true,
      locked: false,
      opacity: 1,
      paths: [],
    };
    
    setLayers(prev => [...prev, newLayer]);
    setActiveLayerId(newLayer.id);
  }, [layers.length]);

  // Redraw when layers change
  useEffect(() => {
    redrawCanvas();
  }, [layers, redrawCanvas]);

  return (
    <div className={`${isFullscreen ? 'fixed inset-0' : 'fixed inset-0'} bg-gray-100 z-50 flex flex-col`}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Pen className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Writing Pad</h2>
          </div>
          
          <div className="text-sm text-gray-600">
            Welcome {childName}! Let your creativity flow ✨
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-sm">
            <button
              onClick={() => setZoom(prev => Math.max(0.25, prev - 0.25))}
              className="p-1 hover:bg-gray-200 rounded"
            >
              -
            </button>
            <span className="px-2">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(prev => Math.min(3, prev + 0.25))}
              className="p-1 hover:bg-gray-200 rounded"
            >
              +
            </button>
          </div>

          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-lg transition-colors ${showGrid ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            <Grid className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowLayers(!showLayers)}
            className={`p-2 rounded-lg transition-colors ${showLayers ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Tools Panel */}
        <AnimatePresence>
          {showTools && (
            <motion.div
              initial={{ x: -250 }}
              animate={{ x: 0 }}
              exit={{ x: -250 }}
              className="w-64 bg-white shadow-lg border-r flex flex-col"
            >
              {/* Tool Selection */}
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-800 mb-3">Tools</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'pen', icon: Pen, label: 'Pen' },
                    { id: 'eraser', icon: Eraser, label: 'Eraser' },
                    { id: 'text', icon: Type, label: 'Text' },
                    { id: 'shapes', icon: Circle, label: 'Shapes' },
                  ].map((tool) => {
                    const IconComponent = tool.icon;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => setCurrentTool(tool.id as any)}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          currentTool === tool.id
                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <IconComponent className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-xs">{tool.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Palette */}
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-800 mb-3">Colors</h3>
                <div className="grid grid-cols-4 gap-2">
                  {colorPalette.map((color) => (
                    <button
                      key={color}
                      onClick={() => setCurrentColor(color)}
                      className={`w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110 ${
                        currentColor === color ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                
                <div className="mt-3">
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => setCurrentColor(e.target.value)}
                    className="w-full h-8 rounded-lg border border-gray-300"
                  />
                </div>
              </div>

              {/* Brush Size */}
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-800 mb-3">Brush Size</h3>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>1px</span>
                  <span>{brushSize}px</span>
                  <span>50px</span>
                </div>
                
                {/* Brush preview */}
                <div className="mt-2 flex justify-center">
                  <div
                    className="rounded-full border"
                    style={{
                      width: Math.max(4, brushSize),
                      height: Math.max(4, brushSize),
                      backgroundColor: currentColor,
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={undo}
                    disabled={historyStep <= 0}
                    className="p-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-lg flex items-center justify-center gap-1 text-sm"
                  >
                    <Undo className="w-4 h-4" />
                    Undo
                  </button>
                  <button
                    onClick={redo}
                    disabled={historyStep >= history.length - 1}
                    className="p-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-lg flex items-center justify-center gap-1 text-sm"
                  >
                    <Redo className="w-4 h-4" />
                    Redo
                  </button>
                </div>

                <button
                  onClick={saveDrawing}
                  className="w-full p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Drawing
                </button>

                <button
                  onClick={downloadImage}
                  className="w-full p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Image
                </button>

                <button
                  onClick={clearCanvas}
                  className="w-full p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          <div 
            ref={containerRef}
            className="flex-1 overflow-auto bg-gray-50 p-4"
            style={{
              backgroundImage: showGrid ? 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)' : 'none',
              backgroundSize: showGrid ? '20px 20px' : 'auto',
            }}
          >
            <div className="flex justify-center items-center min-h-full">
              <canvas
                ref={canvasRef}
                className="bg-white shadow-lg rounded-lg cursor-crosshair"
                style={{
                  transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                  transformOrigin: 'center',
                }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onClick={addText}
              />
            </div>
          </div>
        </div>

        {/* Layers Panel */}
        <AnimatePresence>
          {showLayers && (
            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              className="w-72 bg-white shadow-lg border-l"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800">Layers</h3>
                  <button
                    onClick={addLayer}
                    className="p-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    +
                  </button>
                </div>

                <div className="space-y-2">
                  {layers.map((layer) => (
                    <div
                      key={layer.id}
                      className={`p-3 rounded-lg border transition-colors ${
                        activeLayerId === layer.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <button
                          onClick={() => setActiveLayerId(layer.id)}
                          className="font-medium text-sm text-left flex-1"
                        >
                          {layer.name}
                        </button>
                        
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setLayers(prev => prev.map(l => 
                                l.id === layer.id ? { ...l, visible: !l.visible } : l
                              ));
                            }}
                            className={`p-1 rounded ${layer.visible ? 'text-blue-600' : 'text-gray-400'}`}
                          >
                            {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          </button>
                          
                          <button
                            onClick={() => {
                              setLayers(prev => prev.map(l => 
                                l.id === layer.id ? { ...l, locked: !l.locked } : l
                              ));
                            }}
                            className={`p-1 rounded ${layer.locked ? 'text-red-600' : 'text-gray-400'}`}
                          >
                            {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span>Opacity:</span>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={layer.opacity}
                          onChange={(e) => {
                            setLayers(prev => prev.map(l => 
                              l.id === layer.id ? { ...l, opacity: Number(e.target.value) } : l
                            ));
                          }}
                          className="flex-1"
                        />
                        <span>{Math.round(layer.opacity * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle tools button */}
      {!showTools && (
        <motion.button
          onClick={() => setShowTools(true)}
          className="fixed left-4 top-1/2 transform -translate-y-1/2 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Settings className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
};