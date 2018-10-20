package tech.ananas.tsp;

import java.util.Date;
import java.util.LinkedList;

public class completeRoute {
	private LinkedList<String> visited;
	private float totalPrice;
	
	public completeRoute(LinkedList<String> visited, float totalPrice) {
		this.visited = visited;
		this.totalPrice = totalPrice;
	}
}
