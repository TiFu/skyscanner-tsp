package tech.ananas.socketio;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.listener.DataListener;

import tech.ananas.models.Route;
import tech.ananas.models.Session;
import tech.ananas.models.SubmitCityListRequest;
import tech.ananas.models.SubmitCityListResponse;
import tech.ananas.models.User;
import tech.ananas.services.FlightServiceException;
import tech.ananas.services.TSPService;

public class SubmitCitiesListener implements DataListener<SubmitCityListRequest> {
	private SocketIO server;
	
	public SubmitCitiesListener(SocketIO server) {
		this.server = server;
	}
	
	@Override
	public void onData(SocketIOClient client, SubmitCityListRequest data, AckRequest ackSender) throws Exception {
		Session session = this.server.getSessionService().getSession(data.getId());
		if (session == null) {
			this.server.sendToClient(client.getSessionId(), "error", "Session not found!");
			return;
		}

		boolean existedBefore = session.findRoute(data.getRouteName()) != null;
		

		if (!client.has("name")) {
			client.set("name", "Unknown");
		}
		User user = new User(client.get("name"));
		System.out.println("Adding new route!");
		Route r = session.addRoute(user, data);
		try {
			this.server.getFlightsService().updateTrip(r);
		} catch (FlightServiceException e) {
			this.server.sendToClient(client.getSessionId(), "error", e.getMessage());
		}
			
		System.out.println("Publishing to clients!");
		this.server.broadcastToSession(data.getId(), "state", session);

		if (!existedBefore) {
			System.out.println("Starting TSP thread!");
			new TspThread(this.server.getTspService(), data, session, server).run();;
//			t.start();
		} else {
			System.out.println("No TSP for you!");
		}
	}

	private class TspThread implements Runnable {
		private SubmitCityListRequest r;
		private TSPService tspService;
		private Session session;
		private SocketIO server;
		
		public TspThread(TSPService tspService, SubmitCityListRequest r, Session session, SocketIO server) {
			this.r = r;
			this.tspService = tspService;
			this.session = session;
			this.server = server;
		}
		
		@Override
		public void run() {
			System.out.println("Calculating TSP Route!");
			Route r = this.tspService.TSProute(this.r);
			System.out.println("Calculated TSP routes!");
			r.setEarliestDeparture(this.r.getEarliestDeparture());
			r.setOwner("TSP");
			r.setRouteName(r.getRouteName() + " - TSP");
			System.out.println("Updating route with trip!");
			try {
				this.server.getFlightsService().updateTrip(r);
			} catch (FlightServiceException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			System.out.println("Updated trip!");
			System.out.println(r.getTrip());
			try {
				this.session.addRoute(r);
			} catch (FlightServiceException e) {
				// TODO Auto-generated catch block
				this.server.broadcastToSession(this.r.getId(), "error", e.getMessage());
				e.printStackTrace();
				return;
			}
			this.server.broadcastToSession(this.r.getId(), "state", this.session);
		}
		
	}
}
