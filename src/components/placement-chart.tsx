"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Placement } from "@/types";

interface PlacementChartProps {
  data: Placement[];
}

export default function PlacementChart({ data }: PlacementChartProps) {
  // Sort placements ascending by year (e.g. 2023, 2024, 2025)
  const chartData = [...data]
    .sort((a, b) => a.year - b.year)
    .map((item) => ({
      year: item.year.toString(),
      "Highest Package (LPA)": item.highestPackage,
      "Average Package (LPA)": item.averagePackage,
    }));

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-2xl bg-muted/10">
        <p className="text-xs text-muted-foreground font-semibold">No placement trend data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[320px] bg-card rounded-2xl p-4 border border-border/80 shadow-inner">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="highestColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgb(124, 58, 237)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="rgb(124, 58, 237)" stopOpacity={0.01} />
            </linearGradient>
            <linearGradient id="averageColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgb(16, 185, 129)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="rgb(16, 185, 129)" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          
          <XAxis
            dataKey="year"
            tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: "bold" }}
            axisLine={{ stroke: "rgba(156,163,175,0.15)" }}
            tickLine={false}
          />
          
          <YAxis
            tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: "bold" }}
            axisLine={{ stroke: "rgba(156,163,175,0.15)" }}
            tickLine={false}
            label={{
              value: "Package in LPA (Lakhs per Annum)",
              angle: -90,
              position: "insideLeft",
              fill: "#9ca3af",
              fontSize: 10,
              fontWeight: "bold",
              offset: 5,
            }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(9, 9, 11, 0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
              color: "#fff",
              fontSize: "12px",
            }}
            labelStyle={{ fontWeight: "bold", color: "#8b5cf6" }}
          />
          
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "11px", fontWeight: "bold" }}
          />

          <Area
            type="monotone"
            dataKey="Highest Package (LPA)"
            stroke="rgb(124, 58, 237)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#highestColor)"
          />
          
          <Area
            type="monotone"
            dataKey="Average Package (LPA)"
            stroke="rgb(16, 185, 129)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#averageColor)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
