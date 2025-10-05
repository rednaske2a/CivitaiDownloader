import { StatsCard } from "../stats-card";
import { Database } from "lucide-react";

export default function StatsCardExample() {
  return <StatsCard title="Total Models" value="47" icon={Database} description="Across all categories" />;
}
