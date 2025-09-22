import { Eye, Search, TrendingDown, TrendingUp, Users } from "lucide-react";
import Metrics from "~/app/_components/layouts/studio/shared/Metrics";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";

const Analytics = () => {
  return (
    <main className="px-4 sm:px-6 pb-6 ">
      <Metrics />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Traffic Sources */}
        <section className="rounded-md border bg-white border-border shadow-sm">
          <div className="border-b border-border p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Traffic Sources
              </h2>
              <Badge variant="secondary" className="text-xs">
                Last 30 days
              </Badge>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Where your readers are coming from
            </p>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 border border-blue-300 bg-blue-50 rounded-lg">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">
                      Recommendations
                    </p>
                    <p className="text-xs text-slate-500">
                      Algorithm suggestions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-700 font-bold text-lg">33%</p>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>+5.2%</span>
                  </div>
                </div>
              </div>
              <Progress
                variant={"info"}
                value={33}
                className="h-2 rounded-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>1,234 visits</span>
                <span>Avg. 2.3 min</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 border border-green-300 bg-green-50 rounded-lg">
                    <Search className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-slate-800 font-semibold">Search</p>
                    <p className="text-xs text-slate-500">Direct searches</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-700 font-bold text-lg">23%</p>
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <TrendingDown className="h-3 w-3" />
                    <span>-2.1%</span>
                  </div>
                </div>
              </div>
              <Progress
                variant={"info"}
                value={23}
                className="h-2 rounded-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>856 visits</span>
                <span>Avg. 3.1 min</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 border border-purple-300 bg-purple-50 rounded-lg">
                    <Eye className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-slate-800 font-semibold">Profile</p>
                    <p className="text-xs text-slate-500">Profile visits</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-700 font-bold text-lg">44%</p>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>+8.7%</span>
                  </div>
                </div>
              </div>
              <Progress
                variant={"info"}
                value={44}
                className="h-2 rounded-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>1,642 visits</span>
                <span>Avg. 4.2 min</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Total Traffic</span>
                <span className="font-bold text-slate-900">3,732 visits</span>
              </div>
            </div>
          </div>
        </section>

        {/* Search Queries */}
        <section className="rounded-md border bg-white border-border shadow-sm">
          <div className="border-b border-border p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Top Search Queries
              </h2>
              <Badge variant="secondary" className="text-xs">
                Last 30 days
              </Badge>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Most searched terms leading to your content
            </p>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border border-yellow-300 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-yellow-700">1</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 font-semibold truncate">
                      Twice NSFW
                    </p>
                    <p className="text-xs text-slate-500">Romance • Drama</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-700 font-bold text-lg">65%</p>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>+12.3%</span>
                  </div>
                </div>
              </div>
              <Progress
                variant={"info"}
                value={65}
                className="h-2 rounded-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>2,425 searches</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border border-gray-300 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-700">2</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 font-semibold truncate">
                      Can Love happen again?
                    </p>
                    <p className="text-xs text-slate-500">
                      Romance • Contemporary
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-700 font-bold text-lg">14%</p>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>+3.1%</span>
                  </div>
                </div>
              </div>
              <Progress
                variant={"info"}
                value={14}
                className="h-2 rounded-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>522 searches</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border border-orange-300 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-orange-700">3</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 font-semibold truncate">
                      Romance stories
                    </p>
                    <p className="text-xs text-slate-500">General • Romance</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-700 font-bold text-lg">21%</p>
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <TrendingDown className="h-3 w-3" />
                    <span>-1.8%</span>
                  </div>
                </div>
              </div>
              <Progress
                variant={"info"}
                value={21}
                className="h-2 rounded-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>783 searches</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-sm">
              <span className="text-slate-600">Total Searches</span>
              <span className="font-bold text-slate-900">3,730 searches</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Analytics;
