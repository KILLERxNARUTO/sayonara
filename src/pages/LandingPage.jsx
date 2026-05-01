import React from 'react';
// Icons for the Dock
import { VscHome, VscRocket, VscCode, VscMail } from 'react-icons/vsc';

// Component Imports
import LiquidEther from '../components/LiquidEther/LiquidEther';
import ScrollStack, { ScrollStackItem } from '../components/ScrollStack/ScrollStack';
import Dock from '../components/Dock/Dock';
import SplashCursor from '../components/SplashCursor/SplashCursor';

import '../styles/global.css';

export default function LandingPage() {
  
  // Dock Configuration
  const dockItems = [
    { icon: <VscHome size={20} />, label: 'Home', onClick: () => console.log('Home') },
    { icon: <VscRocket size={20} />, label: 'Automation', onClick: () => console.log('Auto') },
    { icon: <VscCode size={20} />, label: 'Dev', onClick: () => console.log('Dev') },
    { icon: <VscMail size={20} />, label: 'Contact', onClick: () => console.log('Contact') },
  ];

  return (
    <div className="landing-container">
      
      {/* 1. VISUAL OVERLAY: Splash Cursor */}
      {/* Renders fluid splashes on top of everything, but passes clicks through */}
      <SplashCursor 
        SIM_RESOLUTION={128}
        DYE_RESOLUTION={1024}
        SPLAT_FORCE={4000}
        COLOR_UPDATE_SPEED={5}
        BACK_COLOR={{ r: 0, g: 0, b: 0 }} // Transparent background
      />

      {/* 2. BACKGROUND: Liquid Ether */}
      {/* The ambient, always-moving fluid background */}
      <div className="background-layer">
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          mouseForce={20}
          cursorSize={100}
          isViscous
          viscous={20}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          autoDemo={true}
          autoSpeed={0.3}
        />
      </div>

      {/* 3. FOREGROUND: Scroll Stack */}
      {/* The actual content user scrolls through */}
      <div className="content-layer">
        <ScrollStack
          itemDistance={100}
          itemScale={0.04}
          itemStackDistance={35}
          stackPosition="25%"
          scaleEndPosition="10%"
          blurAmount={8}
          useWindowScroll={false} // Uses internal container scrolling
        >
          
          {/* HERO CARD */}
          <ScrollStackItem itemClassName="glass-card hero-card">
            <div className="card-inner">
              <div className="badge">AI AUTOMATION • WEB • APP</div>
              <h1>Sayonara<span className="dot">.</span></h1>
              <p className="hero-text">
                We build the software that builds the future. 
                Say goodbye to manual inefficiencies.
              </p>
            </div>
          </ScrollStackItem>

          {/* AI AUTOMATION CARD */}
          <ScrollStackItem itemClassName="glass-card">
             <div className="card-inner">
              <h2>AI Automation</h2>
              <p>
                Our autonomous agents don't just execute tasks; they optimize them.
                From predictive supply chains to self-healing codebases.
              </p>
              <div className="grid-features">
                 <div className="feat">Neural Networks</div>
                 <div className="feat">NLP Agents</div>
                 <div className="feat">Predictive Analytics</div>
              </div>
            </div>
          </ScrollStackItem>

           {/* DEVELOPMENT CARD */}
           <ScrollStackItem itemClassName="glass-card">
             <div className="card-inner">
              <h2>Web & App Ecosystems</h2>
              <p>
                Fluid interfaces powered by React, Next.js, and Native technologies.
                We craft digital experiences that feel organic, not mechanical.
              </p>
               <div className="grid-features">
                 <div className="feat">React Native</div>
                 <div className="feat">WebGL</div>
                 <div className="feat">Cloud Architecture</div>
              </div>
            </div>
          </ScrollStackItem>

           {/* CONTACT CARD */}
           <ScrollStackItem itemClassName="glass-card cta-card">
             <div className="card-inner">
              <h2>Evolve Your Stack</h2>
              <p>The future is fluid. Let's build it together.</p>
              <button className="primary-btn">
                Launch Project
              </button>
            </div>
          </ScrollStackItem>

        </ScrollStack>
      </div>

      {/* 4. UI LAYER: Dock */}
      {/* Fixed navigation at the bottom */}
      <div className="dock-layer">
        <Dock 
          items={dockItems} 
          panelHeight={60} 
          baseItemSize={45} 
          magnification={65} 
          distance={100}
        />
      </div>

    </div>
  );
}