const page = () => {
  return <div>page</div>;
};

export default page;
// "use client";
// import {
//   ArcElement,
//   BarElement,
//   CategoryScale,
//   Chart,
//   Tooltip as ChartTooltip,
//   Legend,
//   LinearScale,
//   LineElement,
//   PointElement,
// } from "chart.js";
// import { useState } from "react";
// import { Bar, Line } from "react-chartjs-2";
// import { Badge } from "~/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "~/components/ui/select";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
// import { api } from "~/trpc/react";
// Chart.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   ChartTooltip,
//   Legend
// );

// const analyticsTabs = [
//   { value: "overview", label: "Overview" },
//   { value: "reads", label: "Reads" },
//   { value: "engagement", label: "Engagement" },
//   { value: "earnings", label: "Earnings" },
//   { value: "chapters", label: "Chapters" },
//   { value: "reviews", label: "Reviews" },
//   { value: "growth", label: "Growth" },
//   { value: "insights", label: "Insights" },
// ];

// const timeRanges = [
//   { value: "7d", label: "Last 7 days" },
//   { value: "30d", label: "Last 30 days" },
//   { value: "90d", label: "Last 90 days" },
//   { value: "all", label: "All time" },
// ];

// export default function AnalyticsPage() {
//   const [selectedStory, setSelectedStory] = useState<string | null>(null);
//   const [tab, setTab] = useState("overview");
//   const [range, setRange] = useState("30d");

//   // Fetch author stories
//   const { data: stories, isLoading: storiesLoading } =
//     api.story.getNovels.useQuery();
//   // Fetch user details for global stats
//   const { data: user } = api.user.getUserDetails.useQuery();

//   // Select first story by default
//   const storyId = selectedStory ?? stories?.[0]?.id;
//   const { data: story, isLoading: storyLoading } =
//     api.story.byID_or_slug.useQuery(
//       storyId ? { query: storyId } : { query: "" },
//       { enabled: !!storyId }
//     );

//   // Prepare chart data (replace with real analytics if available)
//   const readsData = {
//     labels: story?.chapters?.map((c) => `Ch. ${c.chapterNumber}`) ?? [],
//     datasets: [
//       {
//         label: "Reads",
//         data:
//           story?.chapters?.map((c) => {
//             try {
//               return JSON.parse(c.readershipAnalytics ?? "{}").total ?? 0;
//             } catch {
//               return 0;
//             }
//           }) ?? [],
//         borderColor: "#6366f1",
//         backgroundColor: "rgba(99,102,241,0.2)",
//         tension: 0.4,
//         fill: true,
//       },
//     ],
//   };

//   const ratingData = {
//     labels: story?.chapters?.map((c) => `Ch. ${c.chapterNumber}`) ?? [],
//     datasets: [
//       {
//         label: "Avg. Rating",
//         data:
//           story?.chapters?.map((c) => {
//             try {
//               return JSON.parse(c.metrics ?? "{}").averageRating ?? 0;
//             } catch {
//               return 0;
//             }
//           }) ?? [],
//         backgroundColor: "#f59e42",
//       },
//     ],
//   };

//   // Loading state
//   if (storiesLoading || storyLoading) {
//     return (
//       <div className="max-w-6xl mx-auto py-10 px-4">
//         <div className="text-center text-lg font-semibold">
//           Loading analytics...
//         </div>
//       </div>
//     );
//   }

//   if (!stories?.length) {
//     return (
//       <div className="max-w-6xl mx-auto py-10 px-4">
//         <div className="text-center text-lg font-semibold">
//           No stories found. Start writing to see analytics!
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto py-10 px-4">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
//         <div>
//           <h1 className="text-3xl font-black text-slate-800">Analytics</h1>
//           <p className="text-muted-foreground mt-1">
//             Deep insights into your stories’ performance, engagement, and
//             earnings.
//           </p>
//         </div>
//         <div className="flex gap-2 items-center">
//           <Select value={storyId} onValueChange={setSelectedStory}>
//             <SelectTrigger className="w-56">
//               <SelectValue placeholder="Select a story" />
//             </SelectTrigger>
//             <SelectContent>
//               {stories.map((s) => (
//                 <SelectItem key={s.id} value={s.id}>
//                   <div className="flex items-center gap-2">
//                     <img
//                       src={s.thumbnail}
//                       alt={s.title}
//                       className="w-8 h-8 rounded object-cover"
//                     />
//                     <span>{s.title}</span>
//                   </div>
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           <Select value={range} onValueChange={setRange}>
//             <SelectTrigger className="w-36">
//               <SelectValue placeholder="Time Range" />
//             </SelectTrigger>
//             <SelectContent>
//               {timeRanges.map((r) => (
//                 <SelectItem key={r.value} value={r.value}>
//                   {r.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       <Tabs value={tab} onValueChange={setTab}>
//         <TabsList className="mb-6 flex flex-wrap gap-2">
//           {analyticsTabs.map((t) => (
//             <TabsTrigger key={t.value} value={t.value} className="px-4 py-2">
//               {t.label}
//             </TabsTrigger>
//           ))}
//         </TabsList>

//         {/* Overview */}
//         <TabsContent value="overview">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Reads</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-black">
//                   {story?.readCount?.toLocaleString() ?? 0}
//                 </div>
//                 <div className="text-xs text-muted-foreground">Total Reads</div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Followers</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-black">
//                   {user?.followersCount ?? 0}
//                 </div>
//                 <div className="text-xs text-muted-foreground">
//                   Total Followers
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Avg. Rating</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-black">
//                   {story?.averageRating?.toFixed(2) ?? "0.00"}
//                 </div>
//                 <div className="text-xs text-muted-foreground">
//                   from {story?.ratingCount ?? 0} ratings
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Chapters</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-black">
//                   {story?.chapterCount ?? 0}
//                 </div>
//                 <div className="text-xs text-muted-foreground">
//                   {story?.isCompleted ? "Completed" : "In Progress"}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Reads by Chapter</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <Line
//                   data={readsData}
//                   options={{ plugins: { legend: { display: false } } }}
//                 />
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Avg. Rating by Chapter</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <Bar
//                   data={ratingData}
//                   options={{ plugins: { legend: { display: false } } }}
//                 />
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         {/* Chapters */}
//         <TabsContent value="chapters">
//           <div className="mb-4">
//             <h2 className="text-lg font-bold mb-2">Chapter Performance</h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full text-sm">
//                 <thead>
//                   <tr className="bg-slate-100">
//                     <th className="px-3 py-2 text-left">Chapter</th>
//                     <th className="px-3 py-2 text-left">Reads</th>
//                     <th className="px-3 py-2 text-left">Avg. Rating</th>
//                     <th className="px-3 py-2 text-left">Word Count</th>
//                     <th className="px-3 py-2 text-left">Locked</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {story?.chapters?.map((c, i) => {
//                     let metrics = {};
//                     let readership = {};
//                     try {
//                       metrics = JSON.parse(c.metrics ?? "{}");
//                       readership = JSON.parse(c.readershipAnalytics ?? "{}");
//                     } catch {}
//                     return (
//                       <tr key={c.id} className="border-b">
//                         <td className="px-3 py-2">{c.title}</td>
//                         <td className="px-3 py-2">
//                           {(readership as any).total ?? 0}
//                         </td>
//                         <td className="px-3 py-2">
//                           {(metrics as any).averageRating?.toFixed(2) ?? "0.00"}
//                         </td>
//                         <td className="px-3 py-2">
//                           {(metrics as any).wordCount ?? 0}
//                         </td>
//                         <td className="px-3 py-2">
//                           {c.isLocked ? (
//                             <Badge variant="destructive">Locked</Badge>
//                           ) : (
//                             <Badge variant="outline">Free</Badge>
//                           )}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </TabsContent>

//         {/* Add more tabs for engagement, earnings, reviews, growth, insights, etc. */}
//         {/* Use the same pattern: fetch real data, visualize, and make it actionable */}
//       </Tabs>
//     </div>
//   );
// }
