import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Compass, Sparkles, Navigation, MapPin, Eye, ArrowRight, Plane, Users, CheckCircle2 } from 'lucide-react';

// Indian Travel Nodes with precise latitude & longitude
export const DESTINATIONS = [
  { id: 'delhi', name: 'Delhi', state: 'NCR', lat: 28.6139, lng: 77.2090, travellers: 480, tag: 'Capital Hub', bestTime: 'Oct - Mar' },
  { id: 'manali', name: 'Manali', state: 'Himachal', lat: 32.2396, lng: 77.1887, travellers: 320, tag: 'Alpine Gateway', bestTime: 'May - Oct' },
  { id: 'leh', name: 'Leh Ladakh', state: 'Ladakh', lat: 34.1526, lng: 77.5771, travellers: 210, tag: 'High Altitude', bestTime: 'Jun - Sep' },
  { id: 'srinagar', name: 'Srinagar', state: 'Kashmir', lat: 34.0837, lng: 74.7973, travellers: 190, tag: 'Paradise Valley', bestTime: 'Apr - Oct' },
  { id: 'rishikesh', name: 'Rishikesh', state: 'Uttarakhand', lat: 30.0869, lng: 78.2676, travellers: 360, tag: 'Yoga & Rafting', bestTime: 'Sep - May' },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, travellers: 290, tag: 'Pink City', bestTime: 'Oct - Mar' },
  { id: 'udaipur', name: 'Udaipur', state: 'Rajasthan', lat: 24.5854, lng: 73.7125, travellers: 240, tag: 'City of Lakes', bestTime: 'Sep - Mar' },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, travellers: 540, tag: 'Coastal Megacity', bestTime: 'Nov - Feb' },
  { id: 'goa', name: 'Goa', state: 'Goa', lat: 15.2993, lng: 74.1240, travellers: 620, tag: 'Tropical Escape', bestTime: 'Nov - Apr' },
  { id: 'bangalore', name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946, travellers: 410, tag: 'Southern Hub', bestTime: 'Year-round' },
  { id: 'kerala', name: 'Munnar / Kerala', state: 'Kerala', lat: 10.0889, lng: 77.0595, travellers: 330, tag: 'Backwaters & Tea', bestTime: 'Sep - Mar' },
  { id: 'varanasi', name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739, travellers: 280, tag: 'Spiritual Cradle', bestTime: 'Oct - Mar' },
  { id: 'amritsar', name: 'Amritsar', state: 'Punjab', lat: 31.6340, lng: 74.8723, travellers: 230, tag: 'Golden Sanctuary', bestTime: 'Oct - Mar' },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, travellers: 260, tag: 'Cultural Capital', bestTime: 'Oct - Mar' }
];

// Curated Travel Routes
export const POPULAR_ROUTES = [
  { id: 'r1', from: 'delhi', to: 'manali', label: 'Delhi → Manali', distance: '540 km', duration: '12h', popularity: '98% Popular', travelMode: 'Volvo / Road' },
  { id: 'r2', from: 'mumbai', to: 'goa', label: 'Mumbai → Goa', distance: '585 km', duration: '10h', popularity: '96% Popular', travelMode: 'Express Train / Drive' },
  { id: 'r3', from: 'delhi', to: 'leh', label: 'Delhi → Leh Ladakh', distance: '980 km', duration: '2 Days', popularity: '94% High Altitude', travelMode: 'Motorcycle / Flight' },
  { id: 'r4', from: 'jaipur', to: 'udaipur', label: 'Jaipur → Udaipur', distance: '395 km', duration: '7h', popularity: '91% Heritage', travelMode: 'Royal Highway' },
  { id: 'r5', from: 'bangalore', to: 'kerala', label: 'Bangalore → Kerala', distance: '475 km', duration: '9h', popularity: '93% Nature', travelMode: 'Scenic Drive' },
  { id: 'r6', from: 'delhi', to: 'rishikesh', label: 'Delhi → Rishikesh', distance: '240 km', duration: '5h', popularity: '95% Adventure', travelMode: 'Train / Highway' }
];

// Helper: convert Lat/Lng to 3D Cartesian coordinates on sphere
function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export default function ThreeHeroGlobe({ onSelectRoute, onSelectDestination }) {
  const containerRef = useRef(null);
  const [activeNode, setActiveNode] = useState(DESTINATIONS[1]); // Default to Manali
  const [activeRoute, setActiveRoute] = useState(POPULAR_ROUTES[0]); // Default to Delhi -> Manali
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, node: null });

  const targetRotationRef = useRef({ x: 0.35, y: -1.35 });
  const currentRotationRef = useRef({ x: 0.35, y: -1.35 });
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 18);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const GLOBE_RADIUS = 6.2;

    // 3. Globe Sphere Mesh with Night Map Grid Texture
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#060a14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw longitude & latitude grid
    ctx.strokeStyle = 'rgba(0, 180, 216, 0.12)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Highlight Indian subcontinent outline zone on texture
    const indX = ((78.9629 + 180) / 360) * canvas.width;
    const indY = ((90 - 20.5937) / 180) * canvas.height;
    const grad = ctx.createRadialGradient(indX, indY, 10, indX, indY, 180);
    grad.addColorStop(0, 'rgba(255, 107, 53, 0.35)');
    grad.addColorStop(0.5, 'rgba(0, 180, 216, 0.15)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(indX - 200, indY - 200, 400, 400);

    const texture = new THREE.CanvasTexture(canvas);
    const globeGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const globeMat = new THREE.MeshPhongMaterial({
      map: texture,
      color: 0x0a1122,
      emissive: 0x050811,
      shininess: 25,
      transparent: true,
      opacity: 0.95
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globe);

    // 4. Atmospheric Halo
    const atmosGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.06, 48, 48);
    const atmosMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.2);
          gl_FragColor = vec4(0.0, 0.7, 1.0, 1.0) * intensity * 0.7;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const atmosphere = new THREE.Mesh(atmosGeo, atmosMat);
    globeGroup.add(atmosphere);

    // 5. Starfield Background
    const starCount = 800;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 80;
      starPositions[i + 1] = (Math.random() - 0.5) * 80;
      starPositions[i + 2] = -10 - Math.random() * 40;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x7dd3fc, size: 0.15, transparent: true, opacity: 0.7 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // 6. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xff8c5a, 1.8);
    dirLight1.position.set(15, 12, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00b4d8, 1.4);
    dirLight2.position.set(-15, -10, -10);
    scene.add(dirLight2);

    // 7. Destination Markers
    const markerGroup = new THREE.Group();
    globeGroup.add(markerGroup);
    const markerMeshes = [];

    DESTINATIONS.forEach((dest) => {
      const pos = latLngToVector3(dest.lat, dest.lng, GLOBE_RADIUS);

      // Outer pulsing ring
      const ringGeo = new THREE.RingGeometry(0.08, 0.16, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xff6b35,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos.clone().multiplyScalar(1.008));
      ringMesh.lookAt(pos.clone().multiplyScalar(2));
      markerGroup.add(ringMesh);

      // Inner glowing core sphere
      const sphereGeo = new THREE.SphereGeometry(0.09, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.position.copy(pos.clone().multiplyScalar(1.012));
      sphereMesh.userData = { destination: dest };
      markerGroup.add(sphereMesh);
      markerMeshes.push(sphereMesh);
    });

    // 8. Flight / Travel Arcs & Flowing Light Particles
    const routeGroup = new THREE.Group();
    globeGroup.add(routeGroup);
    const curveObjects = [];

    POPULAR_ROUTES.forEach((route) => {
      const fromDest = DESTINATIONS.find((d) => d.id === route.from);
      const toDest = DESTINATIONS.find((d) => d.id === route.to);
      if (!fromDest || !toDest) return;

      const p1 = latLngToVector3(fromDest.lat, fromDest.lng, GLOBE_RADIUS);
      const p2 = latLngToVector3(toDest.lat, toDest.lng, GLOBE_RADIUS);

      // Calculate mid-elevation point
      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      const distance = p1.distanceTo(p2);
      const altitude = GLOBE_RADIUS + distance * 0.28;
      mid.normalize().multiplyScalar(altitude);

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(40);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);

      const lineMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.45,
        linewidth: 1.5
      });
      const line = new THREE.Line(lineGeo, lineMat);
      routeGroup.add(line);

      // Animated traveling glowing bead on the curve
      const particleGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const particleMat = new THREE.MeshBasicMaterial({ color: 0xff9e79 });
      const particle = new THREE.Mesh(particleGeo, particleMat);
      routeGroup.add(particle);

      curveObjects.push({
        route,
        curve,
        particle,
        progress: Math.random()
      });
    });

    // 9. Mouse interaction & Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;

      if (isDraggingRef.current) {
        const deltaX = e.clientX - prevMouseRef.current.x;
        const deltaY = e.clientY - prevMouseRef.current.y;
        targetRotationRef.current.y += deltaX * 0.005;
        targetRotationRef.current.x += deltaY * 0.005;
        targetRotationRef.current.x = Math.max(-0.8, Math.min(0.8, targetRotationRef.current.x));
        prevMouseRef.current = { x: e.clientX, y: e.clientY };
      } else {
        // Raycast for hover
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(markerMeshes);
        if (intersects.length > 0) {
          const dest = intersects[0].object.userData.destination;
          setTooltip({
            visible: true,
            x: e.clientX - rect.left + 15,
            y: e.clientY - rect.top - 15,
            node: dest
          });
          container.style.cursor = 'pointer';
        } else {
          setTooltip((prev) => ({ ...prev, visible: false }));
          container.style.cursor = 'grab';
        }
      }
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const handleClick = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markerMeshes);
      if (intersects.length > 0) {
        const dest = intersects[0].object.userData.destination;
        setActiveNode(dest);
        if (onSelectDestination) onSelectDestination(dest);
      }
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('click', handleClick);

    // Initial India alignment
    // India is around lat 20-30 N, lng 78 E
    targetRotationRef.current = { x: 0.38, y: -1.38 };

    // 10. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Smooth interpolation to target rotation
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.08;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.08;

      globeGroup.rotation.x = currentRotationRef.current.x;
      globeGroup.rotation.y = currentRotationRef.current.y;

      // Gentle auto-drift if not dragging
      if (!isDraggingRef.current) {
        targetRotationRef.current.y += 0.0006;
      }

      // Animate flight particles along bezier curves
      curveObjects.forEach((obj) => {
        obj.progress = (obj.progress + delta * 0.3) % 1.0;
        const pt = obj.curve.getPoint(obj.progress);
        obj.particle.position.copy(pt);
      });

      // Pulse markers
      const scale = 1.0 + Math.sin(clock.getElapsedTime() * 3.5) * 0.15;
      markerGroup.children.forEach((child) => {
        if (child.geometry && child.geometry.type === 'RingGeometry') {
          child.scale.set(scale, scale, 1);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // 11. Handle Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('click', handleClick);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Function to smoothly rotate globe to a specific destination
  const focusDestination = (dest) => {
    setActiveNode(dest);
    const targetY = -((dest.lng + 180) * (Math.PI / 180)) + Math.PI * 0.95;
    const targetX = ((dest.lat - 20) * (Math.PI / 180)) * 0.4;
    targetRotationRef.current = { x: targetX, y: targetY };
    if (onSelectDestination) onSelectDestination(dest);
  };

  // Function to focus a route and update hero search
  const focusRoute = (route) => {
    setActiveRoute(route);
    const toDest = DESTINATIONS.find((d) => d.id === route.to);
    if (toDest) {
      focusDestination(toDest);
    }
    if (onSelectRoute) onSelectRoute(route);
  };

  return (
    <div className="relative w-full h-[520px] sm:h-[620px] lg:h-[700px] select-none">
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Interactive Route Selector Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-[#0c111d]/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full shadow-lg text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-white/90">Live 3D Travel Network:</span>
          <span className="text-saffron-400 font-medium">1,480+ Explorers Active</span>
        </div>

        <div className="hidden sm:flex pointer-events-auto items-center gap-1.5 bg-[#0c111d]/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full shadow-lg text-xs text-white/70">
          <Compass className="w-3.5 h-3.5 text-azure-400" />
          <span>Drag to orbit India • Click nodes to explore</span>
        </div>
      </div>

      {/* Popular Route Fast-Pill Switchers */}
      <div className="absolute bottom-6 left-4 right-4 z-20 flex items-center justify-center">
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 scrollbar-none px-2 py-2 bg-[#0c111d]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/40 px-2 flex items-center gap-1 whitespace-nowrap">
            <Sparkles className="w-3 h-3 text-saffron-400" /> Top Routes:
          </span>
          {POPULAR_ROUTES.map((route) => (
            <button
              key={route.id}
              onClick={() => focusRoute(route)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeRoute?.id === route.id
                  ? 'bg-gradient-to-r from-saffron-500 to-amber-500 text-white shadow-lg shadow-saffron-500/25 scale-[1.02]'
                  : 'bg-white/5 hover:bg-white/10 text-white/80 border border-white/5'
              }`}
            >
              <Navigation className="w-3 h-3 rotate-45 text-current" />
              <span>{route.label}</span>
              <span className="text-[10px] opacity-75 font-mono">({route.duration})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Floating Active Node Telemetry Card */}
      {activeNode && (
        <div className="absolute bottom-24 left-4 sm:left-8 z-20 max-w-xs bg-[#0c111d]/95 backdrop-blur-xl border border-white/15 p-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-left-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-saffron-500/20 text-saffron-400 border border-saffron-500/30">
              {activeNode.tag}
            </span>
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
              <Users className="w-3 h-3" />
              <span>{activeNode.travellers} Buddies</span>
            </div>
          </div>
          <h3 className="text-xl font-display font-bold text-white mb-0.5">{activeNode.name}</h3>
          <p className="text-xs text-white/60 mb-3">{activeNode.state}, India • Best Season: {activeNode.bestTime}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectDestination && onSelectDestination(activeNode)}
              className="flex-1 btn-saffron text-xs py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 font-semibold"
            >
              <span>Explore {activeNode.name}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Hover Tooltip Overlay */}
      {tooltip.visible && tooltip.node && (
        <div
          className="absolute z-30 pointer-events-none bg-[#090d16]/95 backdrop-blur-md border border-saffron-500/40 px-3 py-2 rounded-xl shadow-xl text-left transform -translate-y-full animate-in fade-in"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <MapPin className="w-3.5 h-3.5 text-saffron-400" />
            <span>{tooltip.node.name}</span>
          </div>
          <p className="text-[10px] text-white/70">{tooltip.node.state} • {tooltip.node.travellers} Active Buddies</p>
        </div>
      )}
    </div>
  );
}
