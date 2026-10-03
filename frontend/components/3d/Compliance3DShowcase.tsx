"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { ShieldCheck, Atom, Globe, Compass, CheckCircle2, Sparkles, ChevronRight, Info } from "lucide-react";

export type ShowcaseMode = "crest" | "molecule" | "globe" | "arabesque";

interface ModeMeta {
  id: ShowcaseMode;
  label: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
}

const MODES: ModeMeta[] = [
  {
    id: "crest",
    label: "Halal Trust Seal",
    tagline: "3D Holographic Crest & Verification Medallion",
    description: "An 8-pointed Rub el Hizb gold & emerald medallion with specular light reflections, symbolizing certifiable ingredient integrity.",
    icon: ShieldCheck,
  },
  {
    id: "molecule",
    label: "Bio-Molecular Lens",
    tagline: "Additive Chemistry & Origin Inspector",
    description: "Interactive 3D chemical lattice representing molecular transparency—differentiating plant esters from hidden animal derivatives.",
    icon: Atom,
  },
  {
    id: "globe",
    label: "Global Standards",
    tagline: "Multi-Jurisdiction Certification Network",
    description: "Wireframe globe with glowing nodes linking global Halal standards (JAKIM, IFANCA, MUI, GSO, Al-Azhar) across continents.",
    icon: Globe,
  },
  {
    id: "arabesque",
    label: "Sacred Arabesque",
    tagline: "Kinetic Geometric Harmonic Star",
    description: "Mesmerizing multi-layered Islamic geometric star tessellation with fluid breathing motion and cursor-driven parallax depth.",
    icon: Compass,
  },
];

export function Compliance3DShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeMode, setActiveMode] = useState<ShowcaseMode>("crest");
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [rotationSpeed, setRotationSpeed] = useState<number>(1);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // References for mouse / touch interaction & physics
  const pointer = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isDown: false, prevX: 0, prevY: 0, velX: 0, velY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 600;
    let height = container.clientHeight || 280;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Sophisticated Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfffdf5, 2.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.6);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe0f2e9, 1.4);
    fillLight.position.set(-4, 2, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xd4af37, 1.8);
    rimLight.position.set(0, -3, 3);
    scene.add(rimLight);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Mode-specific objects cleanup holders
    const disposables: { dispose: () => void }[] = [];

    // Helper: Build Canvas Texture for Medallion
    const createMedallionTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Deep emerald background
        const grad = ctx.createRadialGradient(512, 512, 100, 512, 512, 512);
        grad.addColorStop(0, "#1E3A2F");
        grad.addColorStop(0.7, "#142720");
        grad.addColorStop(1, "#0A1410");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 1024);

        // Circular Gold Ring Border
        ctx.strokeStyle = "#D4AF37";
        ctx.lineWidth = 24;
        ctx.beginPath();
        ctx.arc(512, 512, 470, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "#F9F6EE";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(512, 512, 440, 0, Math.PI * 2);
        ctx.stroke();

        // Arabesque 8-point star pattern behind text
        ctx.strokeStyle = "rgba(212, 175, 55, 0.25)";
        ctx.lineWidth = 8;
        for (let i = 0; i < 4; i++) {
          ctx.save();
          ctx.translate(512, 512);
          ctx.rotate((i * Math.PI) / 4);
          ctx.strokeRect(-280, -280, 560, 560);
          ctx.restore();
        }

        // Halal Typography Calligraphy
        ctx.fillStyle = "#F5E6BE";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 130px 'Cinzel', 'Playfair Display', serif";
        ctx.fillText("حلال", 512, 430);

        ctx.fillStyle = "#EAE6DF";
        ctx.font = "bold 64px 'Inter', sans-serif";
        ctx.letterSpacing = "6px";
        ctx.fillText("TAQWALENS", 512, 560);

        ctx.fillStyle = "#9ED8B9";
        ctx.font = "600 32px 'JetBrains Mono', monospace";
        ctx.fillText("VERIFIED AUDIT PURITY", 512, 630);

        ctx.fillStyle = "#D4AF37";
        ctx.font = "bold 28px sans-serif";
        ctx.fillText("★  JAKIM • IFANCA • CODEX ALIGNED  ★", 512, 700);
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      disposables.push(tex);
      return tex;
    };

    // ==========================================
    // BUILD MODE 1: HALAL TRUST SEAL CREST
    // ==========================================
    if (activeMode === "crest") {
      const crestGroup = new THREE.Group();
      rootGroup.add(crestGroup);

      // Gold Metallic Material
      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.85,
        roughness: 0.18,
      });
      disposables.push(goldMat);

      const emeraldMat = new THREE.MeshStandardMaterial({
        color: 0x1e3a2f,
        metalness: 0.4,
        roughness: 0.3,
      });
      disposables.push(emeraldMat);

      // 8-Pointed Star Geometry (2 overlapping rotated beveled square prisms)
      const boxGeo = new THREE.BoxGeometry(2.4, 2.4, 0.22);
      disposables.push(boxGeo);

      const starSquare1 = new THREE.Mesh(boxGeo, goldMat);
      crestGroup.add(starSquare1);

      const starSquare2 = new THREE.Mesh(boxGeo, goldMat);
      starSquare2.rotation.z = Math.PI / 4;
      crestGroup.add(starSquare2);

      // Central Embossed Medallion Cylinder
      const cylGeo = new THREE.CylinderGeometry(1.22, 1.22, 0.26, 48);
      disposables.push(cylGeo);

      const medallionMat = new THREE.MeshStandardMaterial({
        map: createMedallionTexture(),
        roughness: 0.25,
        metalness: 0.35,
      });
      disposables.push(medallionMat);

      const medallionMesh = new THREE.Mesh(cylGeo, medallionMat);
      medallionMesh.rotation.x = Math.PI / 2;
      crestGroup.add(medallionMesh);

      // Outer Floating Gold Gyro Ring
      const ringGeo = new THREE.TorusGeometry(1.9, 0.035, 16, 80);
      disposables.push(ringGeo);
      const ringMesh = new THREE.Mesh(ringGeo, goldMat);
      ringMesh.rotation.x = Math.PI / 3;
      crestGroup.add(ringMesh);

      const innerRingGeo = new THREE.TorusGeometry(1.65, 0.025, 16, 80);
      disposables.push(innerRingGeo);
      const innerRingMesh = new THREE.Mesh(innerRingGeo, goldMat);
      innerRingMesh.rotation.y = Math.PI / 3;
      crestGroup.add(innerRingMesh);

      // Ambient Floating Sparkle Particles
      const particleGeo = new THREE.BufferGeometry();
      const particleCount = 40;
      const posArray = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 5.0;
        posArray[i + 1] = (Math.random() - 0.5) * 3.5;
        posArray[i + 2] = (Math.random() - 0.5) * 3.0;
      }
      particleGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
      disposables.push(particleGeo);

      const particleMat = new THREE.PointsMaterial({
        color: 0xd4af37,
        size: 0.05,
        transparent: true,
        opacity: 0.7,
      });
      disposables.push(particleMat);

      const particleSystem = new THREE.Points(particleGeo, particleMat);
      crestGroup.add(particleSystem);
    }

    // ==========================================
    // BUILD MODE 2: BIO-MOLECULAR LENS
    // ==========================================
    else if (activeMode === "molecule") {
      const molGroup = new THREE.Group();
      rootGroup.add(molGroup);

      // Materials for atoms
      const carbonMat = new THREE.MeshStandardMaterial({
        color: 0x1e3a2f, // Deep emerald
        roughness: 0.2,
        metalness: 0.3,
      });
      disposables.push(carbonMat);

      const oxygenMat = new THREE.MeshStandardMaterial({
        color: 0xd97706, // Amber gold
        roughness: 0.15,
        metalness: 0.2,
      });
      disposables.push(oxygenMat);

      const nitrogenMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7, // Clean sky cyan
        roughness: 0.2,
        metalness: 0.2,
      });
      disposables.push(nitrogenMat);

      const hydrogenMat = new THREE.MeshStandardMaterial({
        color: 0xf5f5f4, // Pearl white
        roughness: 0.1,
        metalness: 0.1,
      });
      disposables.push(hydrogenMat);

      const bondMat = new THREE.MeshStandardMaterial({
        color: 0xa8a29e,
        roughness: 0.3,
        metalness: 0.5,
      });
      disposables.push(bondMat);

      // Coordinates for a representative bioactive ester molecule (e.g. glycerol backbone + ester chain)
      const atomNodes = [
        { pos: new THREE.Vector3(0, 0, 0), mat: carbonMat, r: 0.36 },
        { pos: new THREE.Vector3(-0.9, 0.6, 0.2), mat: carbonMat, r: 0.36 },
        { pos: new THREE.Vector3(0.9, 0.6, -0.2), mat: carbonMat, r: 0.36 },
        { pos: new THREE.Vector3(-1.8, -0.1, 0.5), mat: oxygenMat, r: 0.32 },
        { pos: new THREE.Vector3(1.8, -0.1, -0.5), mat: oxygenMat, r: 0.32 },
        { pos: new THREE.Vector3(0, -1.0, 0.4), mat: oxygenMat, r: 0.32 },
        { pos: new THREE.Vector3(-0.7, -1.7, 0.2), mat: nitrogenMat, r: 0.34 },
        { pos: new THREE.Vector3(0.7, -1.7, 0.2), mat: carbonMat, r: 0.36 },
        { pos: new THREE.Vector3(1.7, 1.4, -0.3), mat: hydrogenMat, r: 0.22 },
        { pos: new THREE.Vector3(-1.7, 1.4, 0.3), mat: hydrogenMat, r: 0.22 },
        { pos: new THREE.Vector3(0, 1.1, -0.6), mat: hydrogenMat, r: 0.22 },
      ];

      atomNodes.forEach((node) => {
        const geo = new THREE.SphereGeometry(node.r, 24, 24);
        disposables.push(geo);
        const mesh = new THREE.Mesh(geo, node.mat);
        mesh.position.copy(node.pos);
        molGroup.add(mesh);
      });

      // Bonds linking atoms
      const bonds = [
        [0, 1], [0, 2], [1, 3], [2, 4], [0, 5], [5, 6], [5, 7], [2, 8], [1, 9], [0, 10]
      ];

      bonds.forEach(([i, j]) => {
        const p1 = atomNodes[i].pos;
        const p2 = atomNodes[j].pos;
        const dist = p1.distanceTo(p2);
        const bondGeo = new THREE.CylinderGeometry(0.065, 0.065, dist, 12);
        disposables.push(bondGeo);

        const bondMesh = new THREE.Mesh(bondGeo, bondMat);
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        bondMesh.position.copy(mid);
        bondMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3().subVectors(p2, p1).normalize());
        molGroup.add(bondMesh);
      });

      // Orbiting electron probability ring
      const haloGeo = new THREE.TorusGeometry(2.3, 0.02, 16, 90);
      disposables.push(haloGeo);
      const haloMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 0.4,
        roughness: 0.2,
      });
      disposables.push(haloMat);
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.rotation.x = Math.PI / 2.6;
      molGroup.add(haloMesh);
    }

    // ==========================================
    // BUILD MODE 3: GLOBAL STANDARDS GLOBE
    // ==========================================
    else if (activeMode === "globe") {
      const globeGroup = new THREE.Group();
      rootGroup.add(globeGroup);

      // Core Glassmorphic Emerald Sphere
      const sphereGeo = new THREE.SphereGeometry(1.6, 36, 36);
      disposables.push(sphereGeo);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0x0f291e,
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.88,
      });
      disposables.push(sphereMat);
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      globeGroup.add(sphereMesh);

      // Wireframe Longitude & Latitude rings
      const wireMat = new THREE.LineBasicMaterial({
        color: 0x34d399,
        transparent: true,
        opacity: 0.45,
      });
      disposables.push(wireMat);

      // Latitude Rings
      for (let lat = -60; lat <= 60; lat += 30) {
        const rad = Math.cos((lat * Math.PI) / 180) * 1.62;
        const y = Math.sin((lat * Math.PI) / 180) * 1.62;
        const ringGeo = new THREE.BufferGeometry();
        const points = [];
        for (let i = 0; i <= 64; i++) {
          const theta = (i / 64) * Math.PI * 2;
          points.push(new THREE.Vector3(Math.cos(theta) * rad, y, Math.sin(theta) * rad));
        }
        ringGeo.setFromPoints(points);
        disposables.push(ringGeo);
        const line = new THREE.Line(ringGeo, wireMat);
        globeGroup.add(line);
      }

      // Longitude Meridians
      for (let lon = 0; lon < 180; lon += 45) {
        const ringGeo = new THREE.BufferGeometry();
        const points = [];
        for (let i = 0; i <= 64; i++) {
          const theta = (i / 64) * Math.PI * 2;
          const p = new THREE.Vector3(Math.cos(theta) * 1.62, Math.sin(theta) * 1.62, 0);
          p.applyAxisAngle(new THREE.Vector3(0, 1, 0), (lon * Math.PI) / 180);
          points.push(p);
        }
        ringGeo.setFromPoints(points);
        disposables.push(ringGeo);
        const line = new THREE.Line(ringGeo, wireMat);
        globeGroup.add(line);
      }

      // Halal Certification Node Capitals (Spherical Coordinates -> Vector3)
      const hubs = [
        { name: "JAKIM (Malaysia)", lat: 3.139, lon: 101.686 },
        { name: "IFANCA (Chicago, USA)", lat: 41.878, lon: -87.629 },
        { name: "Al-Azhar (Cairo, Egypt)", lat: 30.044, lon: 31.235 },
        { name: "GIMDES (Istanbul, Turkey)", lat: 41.008, lon: 28.978 },
        { name: "BPJPH (Jakarta, Indonesia)", lat: -6.208, lon: 106.845 },
      ];

      const hubVectors: THREE.Vector3[] = [];
      const nodeMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        emissive: 0xb45309,
        emissiveIntensity: 0.8,
        roughness: 0.1,
      });
      disposables.push(nodeMat);

      hubs.forEach((hub) => {
        const phi = (90 - hub.lat) * (Math.PI / 180);
        const theta = (hub.lon + 180) * (Math.PI / 180);
        const radius = 1.64;
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = radius * Math.sin(phi) * Math.sin(theta);
        const y = radius * Math.cos(phi);
        const vec = new THREE.Vector3(x, y, z);
        hubVectors.push(vec);

        const nodeGeo = new THREE.SphereGeometry(0.08, 16, 16);
        disposables.push(nodeGeo);
        const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
        nodeMesh.position.copy(vec);
        globeGroup.add(nodeMesh);
      });

      // Arcs connecting certification hubs
      const arcMat = new THREE.LineBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.8,
      });
      disposables.push(arcMat);

      for (let i = 0; i < hubVectors.length; i++) {
        const next = (i + 1) % hubVectors.length;
        const v1 = hubVectors[i];
        const v2 = hubVectors[next];
        const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5).normalize().multiplyScalar(2.1);
        const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
        const arcPoints = curve.getPoints(32);
        const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPoints);
        disposables.push(arcGeo);
        const arcLine = new THREE.Line(arcGeo, arcMat);
        globeGroup.add(arcLine);
      }
    }

    // ==========================================
    // BUILD MODE 4: SACRED ARABESQUE GEOMETRY
    // ==========================================
    else if (activeMode === "arabesque") {
      const arabesqueGroup = new THREE.Group();
      rootGroup.add(arabesqueGroup);

      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.8,
        roughness: 0.2,
      });
      disposables.push(goldMat);

      const emeraldMat = new THREE.MeshStandardMaterial({
        color: 0x1e3a2f,
        metalness: 0.3,
        roughness: 0.3,
      });
      disposables.push(emeraldMat);

      // Create concentric nested geometric star polygons
      const layers = [
        { scale: 1.8, count: 8, thickness: 0.035, z: 0, mat: goldMat, rotSpeed: 0.3 },
        { scale: 1.4, count: 8, thickness: 0.03, z: 0.15, mat: emeraldMat, rotSpeed: -0.4 },
        { scale: 1.0, count: 16, thickness: 0.025, z: 0.3, mat: goldMat, rotSpeed: 0.6 },
        { scale: 0.6, count: 8, thickness: 0.02, z: 0.45, mat: emeraldMat, rotSpeed: -0.8 },
      ];

      layers.forEach((layer) => {
        const starGeo = new THREE.BufferGeometry();
        const points: THREE.Vector3[] = [];
        const n = layer.count;
        for (let i = 0; i <= n * 2; i++) {
          const r = i % 2 === 0 ? layer.scale : layer.scale * 0.55;
          const theta = (i / (n * 2)) * Math.PI * 2;
          points.push(new THREE.Vector3(Math.cos(theta) * r, Math.sin(theta) * r, 0));
        }
        starGeo.setFromPoints(points);
        disposables.push(starGeo);

        const lineMat = new THREE.LineBasicMaterial({
          color: layer.mat === goldMat ? 0xd4af37 : 0x2dd4bf,
          linewidth: 2,
        });
        disposables.push(lineMat);

        const starLine = new THREE.Line(starGeo, lineMat);
        starLine.position.z = layer.z;
        (starLine as unknown as { customRotSpeed: number }).customRotSpeed = layer.rotSpeed;
        arabesqueGroup.add(starLine);
      });

      // Center glowing gemstone
      const jewelGeo = new THREE.OctahedronGeometry(0.3, 0);
      disposables.push(jewelGeo);
      const jewelMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 0.5,
        roughness: 0.1,
        metalness: 0.9,
      });
      disposables.push(jewelMat);
      const jewelMesh = new THREE.Mesh(jewelGeo, jewelMat);
      jewelMesh.position.z = 0.5;
      arabesqueGroup.add(jewelMesh);
    }

    // Pointer event listeners for interactive rotation
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const rect = container.getBoundingClientRect();
      const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((clientY - rect.top) / rect.height) * 2 - 1);

      pointer.current.targetX = nx * 0.65;
      pointer.current.targetY = ny * 0.45;

      if (pointer.current.isDown) {
        setHasInteracted(true);
        const dx = clientX - pointer.current.prevX;
        const dy = clientY - pointer.current.prevY;
        pointer.current.velX = dx * 0.008;
        pointer.current.velY = dy * 0.008;
        rootGroup.rotation.y += pointer.current.velX;
        rootGroup.rotation.x += pointer.current.velY;
        pointer.current.prevX = clientX;
        pointer.current.prevY = clientY;
      }
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      pointer.current.isDown = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      pointer.current.prevX = clientX;
      pointer.current.prevY = clientY;
    };

    const handlePointerUp = () => {
      pointer.current.isDown = false;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);

    // 4. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera tilt follow
      pointer.current.x += (pointer.current.targetX - pointer.current.x) * 0.05;
      pointer.current.y += (pointer.current.targetY - pointer.current.y) * 0.05;

      if (!pointer.current.isDown) {
        // Inertia damping
        pointer.current.velX *= 0.94;
        pointer.current.velY *= 0.94;
        rootGroup.rotation.y += pointer.current.velX;
        rootGroup.rotation.x += pointer.current.velY;

        // Idle slow harmonic spin
        const baseSpeed = isHovered ? 0.3 : 0.6;
        rootGroup.rotation.y += delta * baseSpeed * rotationSpeed;
        rootGroup.rotation.x = Math.sin(elapsedTime * 0.8) * 0.08 + pointer.current.y * 0.3;
        rootGroup.position.y = Math.sin(elapsedTime * 1.4) * 0.06;
      }

      // Sacred Arabesque child rotations
      if (activeMode === "arabesque") {
        rootGroup.children.forEach((child) => {
          if (child instanceof THREE.Group) {
            child.children.forEach((star) => {
              const speed = (star as unknown as { customRotSpeed?: number }).customRotSpeed;
              if (speed) {
                star.rotation.z += delta * speed;
              }
            });
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const cr = entry.contentRect;
        if (cr.width > 0 && cr.height > 0) {
          camera.aspect = cr.width / cr.height;
          camera.updateProjectionMatrix();
          renderer.setSize(cr.width, cr.height);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      resizeObserver.disconnect();
      cancelAnimationFrame(animId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      disposables.forEach((d) => d.dispose());
    };
  }, [activeMode, isHovered, rotationSpeed]);

  const currentMeta = MODES.find((m) => m.id === activeMode) || MODES[0];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full bg-[#FAF8F5]/90 backdrop-blur-md border border-[#EAE6DF] rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col justify-between relative overflow-hidden transition-all hover:border-[#1E3A2F]/30 hover:shadow-sm"
    >
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />

      {/* Header Bar with Interactive Switcher Tabs */}
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-3 z-10 shrink-0 border-b border-[#EAE6DF] pb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80">
            <Sparkles className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm text-[#1C1917]">
              Interactive 3D Trust Showcase
            </h3>
            <p className="text-[11px] text-[#78716C]">
              Click tabs below to test & preview each 3D concept live
            </p>
          </div>
        </div>

        {/* 4-Pill Mode Switcher Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap bg-white/90 p-1 rounded-xl border border-[#EAE6DF] shadow-2xs">
          {MODES.map((mode) => {
            const Icon = mode.icon;
            const isSelected = mode.id === activeMode;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setActiveMode(mode.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-[#1E3A2F] text-[#FAF8F5] shadow-xs scale-102"
                    : "text-[#57534E] hover:text-[#1C1917] hover:bg-black/5"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-emerald-300" : "text-[#78716C]"}`} />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 3D Stage & Context Banner */}
      <div className="relative w-full grid grid-cols-1 lg:grid-cols-12 gap-4 items-center my-2 min-h-[240px] z-10">
        {/* Left Information Column */}
        <div className="lg:col-span-4 flex flex-col justify-center space-y-2.5 pr-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-full w-fit">
            <span>Concept: {currentMeta.label}</span>
          </div>

          <h4 className="font-serif font-bold text-base text-[#1C1917] leading-snug">
            {currentMeta.tagline}
          </h4>

          <p className="text-xs text-[#57534E] leading-relaxed">
            {currentMeta.description}
          </p>

          <div className="flex items-center gap-2 pt-1 text-[11px] text-[#78716C]">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Real-time WebGL
            </span>
            <span>•</span>
            <span>Interactive 360° Drag</span>
          </div>
        </div>

        {/* Right 3D Viewport Stage */}
        <div
          ref={containerRef}
          className="lg:col-span-8 w-full h-[250px] sm:h-[280px] rounded-xl relative cursor-grab active:cursor-grabbing select-none touch-none flex items-center justify-center"
        >
          {/* Subtle Viewport Watermark / Hint */}
          <div className="absolute bottom-2 right-2 text-[10px] font-mono text-[#A8A29E] bg-white/70 backdrop-blur-xs px-2 py-0.5 rounded border border-[#EAE6DF] pointer-events-none">
            Drag to Rotate • 60 FPS
          </div>
        </div>
      </div>

      {/* Footer Info Strip */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 pt-2.5 border-t border-[#EAE6DF] text-[11px] text-[#78716C] z-10 shrink-0">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-emerald-700" />
          <span>Which 3D concept do you prefer above the Dietary Notice? Tell me your favorite!</span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span>Shafi&apos;i • Hanafi • Maliki • Hanbali</span>
        </div>
      </div>
    </div>
  );
}
