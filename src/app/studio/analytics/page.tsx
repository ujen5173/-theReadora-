import Metrics from "~/app/_components/layouts/studio/shared/Metrics";
import { Progress } from "~/components/ui/progress";

const Analytics = () => {
  return (
    <main className="px-6">
      <Metrics />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="rounded-md border bg-white border-border">
          <div className="border-b border-border p-4">
            <h2 className="text-base font-bold">Traffic sources</h2>
          </div>

          <div className="p-4 space-y-6">
            <div className="">
              <div className="flex items-center justify-between gap-2 space-y-2 flex-1">
                <p className="font-semibold">Recommendations</p>
                <p className="text-slate-800 font-extrabold">33%</p>
              </div>
              <Progress
                variant={"info"}
                value={33}
                className="h-3 rounded-xs"
              />
            </div>
            <div className="">
              <div className="flex items-center justify-between gap-2 space-y-2 flex-1">
                <p className="font-semibold">Search</p>
                <p className="text-slate-800 font-extrabold">23%</p>
              </div>
              <Progress
                variant={"info"}
                value={23}
                className="h-3 rounded-xs"
              />
            </div>
            <div className="">
              <div className="flex items-center justify-between gap-2 space-y-2 flex-1">
                <p className="font-semibold">Profile</p>
                <p className="text-slate-800 font-extrabold">44%</p>
              </div>
              <Progress
                variant={"info"}
                value={44}
                className="h-3 rounded-xs"
              />
            </div>
          </div>
        </section>

        <section className="rounded-md border bg-white border-border">
          <div className="border-b border-border p-4">
            <h2 className="text-base font-bold">Search queries</h2>
          </div>

          <div className="p-4 space-y-6">
            <div className="">
              <div className="flex items-center justify-between gap-2 space-y-2 flex-1">
                <p className="font-semibold">Twice NSFW</p>
                <p className="text-slate-800 font-extrabold">65%</p>
              </div>
              <Progress
                variant={"info"}
                value={65}
                className="h-3 rounded-xs"
              />
            </div>
            <div className="">
              <div className="flex items-center justify-between gap-2 space-y-2 flex-1">
                <p className="font-semibold">Can Love happen again?</p>
                <p className="text-slate-800 font-extrabold">14%</p>
              </div>
              <Progress
                variant={"info"}
                value={14}
                className="h-3 rounded-xs"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Analytics;
