package tech.ananas.models;

import java.util.LinkedList;
import java.util.List;

public class Session {
	private String id;
	private List<User> users;
	private List<Route> routes;
	
	public Session(String id, User user) {
		this.id = id;
		this.users = new LinkedList<>();
		this.users.add(user);
		this.routes = new LinkedList<>();
	}

	public String getId() {
		return id;
	}

	public List<User> getUsers() {
		return users;
	}

	public List<Route> getRoutes() {
		return routes;
	}

	public boolean updateRoute(ReorderCitiesRequest data) {
		Route route = this.findRoute(data.getRouteName());
		if (route == null) {
			return false;
		} else {
			route.update(data);
			return true;
		}
	}

	private Route findRoute(String name) {
		for (Route r: this.routes) {
			if (r.getRouteName().equals(name)) {
				return r;
			}
		}
		return null;
	}
	public Route getRoute(String routeName) {
		return this.findRoute(routeName);
	}

	public Route addRoute(User owner, SubmitCityListRequest data) {
		Route r = new Route();
		r.setRouteName(data.getRouteName());
		r.setEarliestDeparture(data.getEarliestDeparture());
		r.setCities(data.getCities());
		r.setIgnoreFlight(data.getIgnoreFlight());
		r.setDurationOfStay(data.getDurationOfStay());
		r.setOwner(owner.getName());
		this.routes.add(r);
		return r;
	}
}
