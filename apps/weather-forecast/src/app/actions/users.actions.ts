import { Injectable } from "@angular/core";
import { IAppState } from "../store/index";
import { NgRedux } from "@angular-redux/store";
import { GeneralService } from "../general.service";

@Injectable()
export class UsersActions {
	static GET_DAILY_WHETHER = "GET_DAILY_WHETHER";
	static GET_HOURLY_WHETHER = "GET_HOURLY_WHETHER";
	static GET_CITIES_LIST = "GET_CITIES_LIST";
	latitude: any;
	longitude: any;


	constructor(
		private ngRedux: NgRedux<IAppState>,
		private gs: GeneralService
	) { }

	getUsers(search: any, select: any) {

		//Get city data
		this.gs.getCities(search).subscribe((res: any) => {
			this.latitude = res[0]?.lat;
			this.longitude = res[0]?.lon;

			if (this.latitude && this.longitude && select === 'Hourly') {

				this.gs
					.getWhether(this.latitude, this.longitude)
					.subscribe((res: any) =>
						this.ngRedux.dispatch({
							type: UsersActions.GET_HOURLY_WHETHER,
							payload: res,
						})
					);
			}

			if (this.latitude && this.longitude && select === 'Daily') {

				this.gs
					.getWhether(this.latitude, this.longitude, 'hourly')
					.subscribe((res: any) => {
						console.log("data", res);

						this.ngRedux.dispatch({
							type: UsersActions.GET_DAILY_WHETHER,
							payload: res,
						});
					});
			}
		});
	}
}
