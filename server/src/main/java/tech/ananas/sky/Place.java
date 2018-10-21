package tech.ananas.sky;

import java.io.Serializable;

public class Place implements Serializable {
    @Override
	public String toString() {
		return "Place [PlaceId=" + PlaceId + ", Name=" + Name + ", Type=" + Type + ", SkyScannerCode=" + SkyScannerCode
				+ "]";
	}
	public long PlaceId;
    public String Name;
    // FIXME: perhaps an enum instead?
    public String Type;
    public String SkyScannerCode;
}
