package tech.ananas.sky;

import java.util.Date;
import java.util.List;

public class Leg {
    @Override
	public String toString() {
		return "Leg [CarrierIds=" + CarrierIds + ", OriginId=" + OriginId + ", DestinationId=" + DestinationId
				+ ", DepartureDate=" + DepartureDate + "]";
	}
	public List<Long> CarrierIds;
    public long OriginId;
    public long DestinationId;
    public String DepartureDate;
    public String code;
}
