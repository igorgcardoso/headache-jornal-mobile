import { ReactNode } from "react";
import { TouchableOpacity } from "react-native";

interface ButtonProps {
  children: ReactNode;
}


export function Button({ children }: ButtonProps) {
  return (
    <TouchableOpacity activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
}
