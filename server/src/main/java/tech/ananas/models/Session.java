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
		Route r = new Route(data.getRouteName(), owner.getName(), data.getCities(), data.getDurationOfStay());
		r.setEarliestDeparture(data.getEarliestDeparture());
		r.setIgnoreFlight(data.getIgnoreFlight());
		this.routes.add(r);
		return r;
	}

	public void updateSelectedAlternative(UpdateAlternativeRequest data) throws UpdateException {
		Route r = this.findRoute(data.getRouteName());
		if (r == null) {
			throw new UpdateException("Unknown route!");
		}
		r.getTrip().getFlights().get(data.getFlightId()).setSelectedAlternative(data.getSelectedAlternative());
	}

	public void deleteRoute(String routeName) {
		Route r = this.findRoute(routeName);
		this.routes.remove(r);
	}

	public void duplicateRoute(String routeName) {
		Route r = this.findRoute(routeName);
		Route copy = new Route(r);
	}
}
