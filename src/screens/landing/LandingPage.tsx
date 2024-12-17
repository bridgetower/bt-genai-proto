import { motion } from "framer-motion";
import { Play } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState<string>("");
  const [getStartedClicked, setGetStartedClicked] = useState(false);

  useEffect(() => {
    console.log("LandingPage component mounted");
  }, []);

  const handleSelectChange = (value: string) => {
    setProjectId(value);
  };

  const handleButtonClick = () => {
    setGetStartedClicked(true);
    if (!projectId) {
      return;
    }
    localStorage.setItem("projectId", projectId);
    navigate("/chat");
  };

  return (
    <div
      className="relative h-screen bg-cover bg-center flex items-center sm:pl-48 pl-8 text-white"
      style={{
        backgroundImage: "url('/images/landing-banner.jpg')"
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content with Animation */}
      <motion.div
        className="relative z-10 text-center max-w-lg sm:scale-125 scale-100"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="sm:text-6xl text-4xl font-bold mb-4">
          <span className="text-yellow-300">GenAI</span>, Unleash the Power of AI
        </h1>
        <p className="text-lg">Empower your ideas with next-gen AI solutions.</p>

        {/* Dropdown Menu */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <Select onValueChange={handleSelectChange} defaultValue={projectId}>
            <SelectTrigger
              className={`w-52 text-gray-600 ring-offset-transparent focus:ring-0 focus:ring-offset-0 border-2 ${!projectId && getStartedClicked && "text-red-500 border-red-500"}`}
            >
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={process.env.REACT_APP_PROJECT_ID || ""}>Project 1</SelectItem>
              <SelectItem value={process.env.REACT_APP_PROJECT_ID || ""}>Project 2</SelectItem>
              <SelectItem value={process.env.REACT_APP_PROJECT_ID || ""}>Project 3</SelectItem>
            </SelectContent>
          </Select>

          {/* CTA Button */}
          <Button
            variant="default"
            title="Select a project and click me to get started"
            className={`bg-sky-500 hover:bg-sky-400 hover:scale-105 transition-transform text-white ${!projectId && "cursor-not-allowed"}`}
            onClick={handleButtonClick}
          >
            <Play className="mr-2 h-5 w-5" /> Get Started
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export { LandingPage };
