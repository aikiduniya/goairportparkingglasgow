export interface ParkingOption {
  id: string;
  name: string;
  price: number;
  type: "park-ride" | "meet-greet";
  distance?: string;
  transferTime?: string;
  features: string[];
  atTerminal?: boolean;
  image: string;
}
