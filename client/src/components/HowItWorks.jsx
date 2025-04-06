import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const HowItWorks = () => {
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);
  const stepsRef = useRef([]);

  useEffect(() => {
    // Create our timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        end: "bottom 70%",
        scrub: 1,
      }
    });

    // Animate title first
    tl.fromTo(".section-title", 
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.3 }
    );

    // For each step, create a sequence animation
    stepsRef.current.forEach((step, index) => {
      // First animate the connection line to the step
      if (index > 0) {
        tl.fromTo(
          `.connection-line-${index}`,
          { scaleY: 0 },
          { scaleY: 1, duration: 0.3 },
          "-=0.1"
        );
      }
      
      // Then animate the number
      tl.fromTo(
        `.step-number-${index}`,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" },
        index > 0 ? "-=0.1" : ""
      );
      
      // Then animate the content
      tl.fromTo(
        `.step-content-${index}`,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3 },
        "-=0.1"
      );
    });

    timelineRef.current = tl;

    return () => {
      // Clean up
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Add steps to refs
  const addToRefs = (el) => {
    if (el && !stepsRef.current.includes(el)) {
      stepsRef.current.push(el);
    }
  };

  return (
    <section ref={sectionRef} className="py-20 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="section-title text-3xl font-bold text-center mb-16 text-purple-800">
          How Local Explorer Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {/* Step 1 */}
          <div ref={addToRefs} className="text-center relative">
            <div className="flex flex-col items-center">
              <div className="step-number-0 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl shadow-md z-10">
                1
              </div>
              <div className="step-content-0 mt-5">
                <h3 className="text-xl font-semibold mb-3 text-purple-800">Create or Join</h3>
                <p className="text-gray-600">Create your own visit or join one that matches your interests and schedule.</p>
              </div>
            </div>
          </div>
          
          {/* Connection Line 1-2 */}
          <div className="hidden md:block absolute left-1/3 transform -translate-x-1/2 top-8 w-1/3 h-0.5">
            <div className="connection-line-1 w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500 origin-left"></div>
          </div>
          
          {/* Step 2 */}
          <div ref={addToRefs} className="text-center relative">
            <div className="flex flex-col items-center">
              <div className="step-number-1 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl shadow-md z-10">
                2
              </div>
              <div className="step-content-1 mt-5">
                <h3 className="text-xl font-semibold mb-3 text-purple-800">Connect</h3>
                <p className="text-gray-600">Meet like-minded explorers and locals willing to show you around.</p>
              </div>
            </div>
          </div>
          
          {/* Connection Line 2-3 */}
          <div className="hidden md:block absolute left-2/3 transform -translate-x-1/2 top-8 w-1/3 h-0.5">
            <div className="connection-line-2 w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500 origin-left"></div>
          </div>
          
          {/* Step 3 */}
          <div ref={addToRefs} className="text-center relative">
            <div className="flex flex-col items-center">
              <div className="step-number-2 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl shadow-md z-10">
                3
              </div>
              <div className="step-content-2 mt-5">
                <h3 className="text-xl font-semibold mb-3 text-purple-800">Explore</h3>
                <p className="text-gray-600">Discover new places and make memories with your new exploration companions.</p>
              </div>
            </div>
          </div>
          
          {/* Mobile connection lines (vertical) */}
          <div className="md:hidden absolute left-1/2 transform -translate-x-1/2 top-16 w-0.5 h-3/4">
            <div className="h-full bg-gradient-to-b from-indigo-500 to-purple-500 origin-top connection-line-mobile"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;