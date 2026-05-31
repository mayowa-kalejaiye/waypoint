"use client";

import LearningPathBuilder from "@/components/LearningPathBuilder";

interface GeneratingScreenProps {
  progress: number;
  visible: boolean;
}

export default function GeneratingScreen({ progress, visible }: GeneratingScreenProps) {
  return <LearningPathBuilder visible={visible} progress={progress} title={"Building your path"} />;
}
