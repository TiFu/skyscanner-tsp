package tech.ananas.socketio;
import java.util.UUID;

import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;

import tech.ananas.models.DuplicateRouteRequest;
import tech.ananas.models.NewSessionRequest;
import tech.ananas.models.ReorderCitiesRequest;
import tech.ananas.models.RestoreSessionRequest;
import tech.ananas.models.Session;
import tech.ananas.models.SubmitCityListRequest;
import tech.ananas.models.UpdateAlternativeRequest;
import tech.ananas.services.FlightsService;
import tech.ananas.services.SessionService;
import tech.ananas.services.SkyscannerAPI;
import tech.ananas.services.TSPService;

public class SocketIO {
	private SocketIOServer server;
	private SessionService sessionService;
	private FlightsService flightsService;
	private SkyscannerAPI skyscannerAPI;
	private TSPService tspService;
	
	public SocketIO(String hostname, int port, SessionService sessionService, FlightsService flightService, SkyscannerAPI skyScannerAPI, TSPService tspService) {
		Configuration configuration = new Configuration();
		configuration.setHostname(hostname);
		configuration.setPort(port);
		this.skyscannerAPI = skyScannerAPI;
		// TODO: this should be injected... 
		this.tspService = tspService;
		this.sessionService = sessionService;
		this.flightsService = flightService;
		this.server = new SocketIOServer(configuration);
		
		this.server.addConnectListener(new ConnectListener() {
			
			@Override
			public void onConnect(SocketIOClient client) {
				System.out.println("New Client: " + "Connected!");
			}
		});
		// add listeners
		this.server.addEventListener("new_session", NewSessionRequest.class, new NewSessionListener(this));
		this.server.addEventListener("restore_session", RestoreSessionRequest.class, new RestoreSessionListener(this));
		this.server.addEventListener("city_list", SubmitCityListRequest.class, new SubmitCitiesListener(this));
		this.server.addEventListener("reorder_cities", ReorderCitiesRequest.class, new ReorderCitiesListener(this));
		this.server.addEventListener("update_selected_alternative", UpdateAlternativeRequest.class, new UpdateAlternativeListener(this));
		this.server.addEventListener("airports", Void.class, new AirportListener(this));
		this.server.addEventListener("copy_route", DuplicateRouteRequest.class, new DuplicateRouteListener(this));
		System.out.println("Started server");
		this.server.start();
	}
	
	public SkyscannerAPI getSkyscannerAPI() {
		return skyscannerAPI;
	}
	public TSPService getTspService() {
		return tspService;
	}

	public SessionService getSessionService() {
		return this.sessionService;
	}
	
	public void sendToClient(UUID client, String event, Object response) {
		this.server.getClient(client).sendEvent(event, response);
	}
	
	public void broadcastToSession(String room, String event, Object data) {
		this.server.getRoomOperations(room).sendEvent(event, data);
	}

	public FlightsService getFlightsService() {
		return this.flightsService;
	}
}
