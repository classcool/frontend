import { DashboardCards } from "./dashboard-cards";

export default function Dashboard() {
	return (
		<>
			<h2>Dashboard</h2>
			<div className="flex flex-1 flex-col">
				<div className="@container/main flex flex-1 flex-col">
					<div className="flex flex-col md:gap-6 md:py-6">
						<DashboardCards />
					</div>
					<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"></div>
				</div>
			</div>
		</>
	);
}
