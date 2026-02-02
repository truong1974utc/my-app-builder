import { Users, FileText, FolderOpen } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const growthData = [
  { name: "Jan", users: 4000 },
  { name: "Feb", users: 3000 },
  { name: "Mar", users: 5000 },
  { name: "Apr", users: 7000 },
  { name: "May", users: 6000 },
  { name: "Jun", users: 8000 },
  { name: "Jul", users: 10000 },
];

const categoryData = [
  { name: "Electronics", value: 35, color: "hsl(245, 75%, 60%)" },
  { name: "Accessories", value: 25, color: "hsl(152, 70%, 45%)" },
  { name: "Audio", value: 20, color: "hsl(38, 95%, 55%)" },
  { name: "Gaming", value: 20, color: "hsl(0, 75%, 55%)" },
];

const DashboardOverview = () => {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Dashboard Overview"
        description="System management and detailed overview."
      />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Platform Users"
          value={4}
          icon={Users}
          trend={{ value: "+8.2%", isPositive: true }}
          iconBgColor="bg-accent"
          iconColor="text-primary"
        />
        <StatCard
          title="Published Pages"
          value={1}
          icon={FileText}
          trend={{ value: "+4.3%", isPositive: true }}
          iconBgColor="bg-info/10"
          iconColor="text-info"
        />
        <StatCard
          title="Stored Documents"
          value={2}
          icon={FolderOpen}
          trend={{ value: "-1.2%", isPositive: false }}
          iconBgColor="bg-muted"
          iconColor="text-muted-foreground"
        />
      </div>

      {/* Charts Section */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Platform Growth Chart */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="text-lg font-semibold text-foreground">Platform Growth</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            User engagement and activity trends over the last 7 months.
          </p>
          <div className="mt-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(245, 75%, 60%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(245, 75%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(220, 10%, 50%)', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(220, 10%, 50%)', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(0, 0%, 100%)',
                    border: '1px solid hsl(220, 15%, 90%)',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="hsl(245, 75%, 60%)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Split Chart */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="text-lg font-semibold text-foreground">Category Split</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Distribution of products across main categories.
          </p>
          <div className="mt-6 h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-foreground"
                >
                  <tspan x="50%" dy="-0.5em" fontSize="28" fontWeight="bold">
                    3
                  </tspan>
                  <tspan x="50%" dy="1.5em" fontSize="12" className="fill-success">
                    TOTAL ITEMS
                  </tspan>
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
