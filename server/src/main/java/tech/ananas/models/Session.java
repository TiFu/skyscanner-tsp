package tech.ananas.models;

import java.util.LinkedList;
import java.util.List;

import tech.ananas.services.FlightServiceException;

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

	public synchronized Route findRoute(String name) {
		for (Route r: this.routes) {
			if (r.getRouteName().equals(name)) {
				return r;
			}
		}
		return null;
	}
	public synchronized Route getRoute(String routeName) {
		return this.findRoute(routeName);
	}

	public synchronized Route addRoute(User owner, SubmitCityListRequest data) throws FlightServiceException {
		Route r = new Route(data.getRouteName(), owner.getName(), data.getCities(), data.getDurationOfStay());
		r.setEarliestDeparture(data.getEarliestDeparture());
		r.setIgnoreFlight(data.getIgnoreFlight());
		this.addRoute(r);
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

	public void duplicateRoute(String routeName) throws FlightServiceException {
		Route r = this.findRoute(routeName);
		Route copy = new Route(r);
		this.addRoute(copy);
	}
	
	public synchronized void addRoute(Route r) throws FlightServiceException {
		// validate that r is consistent
		if (r.getTrip() != null) {
			for (FlightAlternatives fa: r.getTrip().getFlights()) {
				if (fa.getAlternatives().size() == 0) {
					throw new FlightServiceException("Couldn't calculate the complete route! Did not save route!");
				}
			}
		}
		this.routes.add(r);
	}
}
