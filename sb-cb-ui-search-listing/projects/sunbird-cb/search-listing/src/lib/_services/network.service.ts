import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
// tslint:disable
import * as _ from "lodash";
import { NSNetworkData } from "../_models/network.model";
// tslint:enable

const API_ENDPOINTS = {
  getRecommendedUsers: "/apis/protected/v8/connections/v2/connections/recommended",
  createConnection: `/apis/protected/v8/connections/v2/add/connection`,
  updateConnection: `/apis/protected/v8/connections/v2/update/connection`,
  connectionRequests: `/apis/protected/v8/connections/v2/connections/requested`,
  connectionRequestsReceived: `/apis/protected/v8/connections/v2/connections/requests/received`,
  connectionEstablished: `/apis/protected/v8/connections/v2/connections/established`,
  getSuggestedUsers: `/apis/protected/v8/connections/v2/connections/suggests`,
  // getUserdetailsV2FromRegistry: '/apis/protected/v8/user/profileRegistry/getUserRegistryByUser',
  getUserdetailsV2FromRegistry: "/apis/proxies/v8/api/user/v2/read"
};

@Injectable({
  providedIn: "root"
})
export class NetworkService {
  constructor(private http: HttpClient) {}
  headers = new HttpHeaders({
    "Cache-Control": "no-cache, no-store, must-revalidate, post-check=0, pre-check=0",
    Pragma: "no-cache",
    Expires: "0"
  });

  fetchProfile(userId: string) {
    return this.http.get<NSNetworkData.IProfile>(`${API_ENDPOINTS.getUserdetailsV2FromRegistry}/${userId}`).pipe(
      map(res => {
        // const roles = _.map(_.get(res, 'result.response.roles'), 'role')
        // _.set(res, 'result.response.roles', roles)
        return res;
      })
    );
  }

  fetchAllConnectionRequests() {  // This method is used to fetch all connection requests.
    return this.http.get<NSNetworkData.IConnectionRequestResponse>(API_ENDPOINTS.connectionRequests, { headers: this.headers });
  }

  fetchAllReceivedConnectionRequests() { // This method is used to fetch all received connection requests.
    return this.http.get<NSNetworkData.IConnectionRequest>(API_ENDPOINTS.connectionRequestsReceived, { headers: this.headers });
  }

  fetchAllRecommendedUsers(data: NSNetworkData.IRecommendedUserReq) { // This method is used to fetch recommended users based on the provided data.
    return this.http.post(API_ENDPOINTS.getRecommendedUsers, data);
  }

  fetchAllSuggestedUsers() { // This method is used to fetch all suggested users.
    return this.http.get(API_ENDPOINTS.getSuggestedUsers);
  }

  createConnection(data: any) { // This method is used to create a new connection with the provided data.
    return this.http.post(API_ENDPOINTS.createConnection, data);
  }

  updateConnection(data: any) { // This method is used to update an existing connection with the provided data.
    return this.http.post(API_ENDPOINTS.updateConnection, data);
  }

  fetchAllConnectionEstablished() { // This method is used to fetch all established connections.
    return this.http.get<NSNetworkData.IEstablishedConnectResopnse>(API_ENDPOINTS.connectionEstablished, { headers: this.headers });
  }

  fetchAllConnectionEstablishedById(wid: any) {  // This method is used to fetch established connections by user ID.
    const url = `${API_ENDPOINTS.connectionEstablished}/${wid}`;
    return this.http.get<NSNetworkData.IEstablishedConnectResopnse>(url, { headers: this.headers });
  }
}
