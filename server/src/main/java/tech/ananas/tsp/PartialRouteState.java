package tech.ananas.tsp;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import tech.ananas.services.TSPService;


public class PartialRouteState {
	private TSPService source;
	private LinkedList<String> visited;
	private LinkedList<String> yetToVisit;
	private double totalCurrentPrice;
	private String currentDate;
	
	public PartialRouteState(TSPService source, PartialRouteState predecessor, String city, int days) {
		this.source = source;
		if (predecessor !=null) {
			visited = predecessor.getVisited();
			yetToVisit = predecessor.getYetToVisit();
			currentDate = predecessor.getCurrentDate();
			totalCurrentPrice = predecessor.totalCurrentPrice + source.getPrice(visited.getLast(), city, currentDate);
			//System.out.println(source.getPrice(visited.getLast(), city, currentDate));
		} else { //initialize for first element
			visited = new LinkedList<String>();
			yetToVisit = new LinkedList<String>();
			yetToVisit = (LinkedList<String>) source.getCityListRequest().getCities();
			currentDate = source.getCityListRequest().getEarliestDeparture();
		}
		
		visited.addLast(city);
		yetToVisit.remove(city);
		currentDate = ""+ LocalDate.parse(currentDate).plusDays(days);
		//System.out.println(currentDate);
		//System.out.println(visited);
		//System.out.println(yetToVisit);
		
		//TODO: problem, if starting city is part of ignoreList, as I can't mark "already done"
		//for the starting city, both neighbor city can be first or last
		
		//falls ignore List
		boolean isFound = false;
		String neighbor = "";
		// using classical for loop
		for(int x = 0; x < source.getCityListRequest().getIgnoreFlight().size(); x++) {
		   LinkedList<String> xlist = (LinkedList<String>) source.getCityListRequest().getIgnoreFlight().get(x);
		   // using for each
		   
			   if (xlist.contains(city)) {
			         isFound = true;
			         if (xlist.getFirst().equals(city)) {
			        	 neighbor = xlist.getLast();
			        	 //source.getCityListRequest().getIgnoreFlight().remove(xlist);
			        	 break;
			         } else {
			        	 neighbor = xlist.getFirst();
			        	 //source.getCityListRequest().getIgnoreFlight().remove(xlist);
			        	 break;
			         }
			   }  
		}

		if (isFound) {
			
			/* if (visited.size() == 1) {
				
				//problem: es muss als letztes kommen
				yetToVisit.remove(neighbor);
				for (String temp : yetToVisit) {
						System.out.println(visited);
						//System.out.println(totalCurrentPrice);
						new PartialRouteState(source, this, temp, source.getDuration(temp));
				}
			} */
			
			//totalCurrentPrice = totalCurrentPrice + source.getPrice(visited.getLast(), neighbor, currentDate);
			visited.addLast(neighbor);
			yetToVisit.remove(neighbor);
			currentDate = ""+ LocalDate.parse(currentDate).plusDays(source.getDuration(neighbor));
		}
		
		if (yetToVisit.isEmpty()) {
			System.out.println("isEmpty");
			totalCurrentPrice = predecessor.totalCurrentPrice + source.getPrice(visited.getLast(), visited.getFirst(), currentDate);
			//System.out.println("priceCalc");
			visited.addLast(visited.getFirst());
			source.getResults().put(totalCurrentPrice, visited);
		} else {
			for (String temp : yetToVisit) {
				System.out.println(visited);
				//System.out.println(totalCurrentPrice);
				new PartialRouteState(source, this, temp, source.getDuration(temp));
			}
		}
		
		//Tiefensuche bevorzugen
		//mit günstigstem totalPrice in source vergleichen und ggf. abbrechen
	}

	public LinkedList<String> getVisited() {
		return new LinkedList<>(visited);
	}

	public LinkedList<String> getYetToVisit() {
		return new LinkedList<>(yetToVisit);
	}

	public double getTotalCurrentPrice() {
		return totalCurrentPrice;
	}

	public String getCurrentDate() {
		return currentDate;
	}
}
