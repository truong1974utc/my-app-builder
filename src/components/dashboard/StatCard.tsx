import { ReactNode } from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  iconBgColor?: string;
  iconColor?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  iconBgColor = "bg-accent",
  iconColor = "text-primary"
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-card-hover animate-fade-in">
      <div className="flex items-start justify-between">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", iconBgColor)}>
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium",
            trend.isPositive ? "text-success" : "text-destructive"
          )}>
            <span>{trend.value}</span>
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="mt-1 text-3xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}
