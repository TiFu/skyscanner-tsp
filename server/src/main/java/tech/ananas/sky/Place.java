package tech.ananas.sky;

public class Place {
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
