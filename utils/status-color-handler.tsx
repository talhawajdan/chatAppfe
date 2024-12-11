"use client";

type Variants = "success" | "warning" | "danger" | "started" | "custom" | "darkDanger" | "primary"|"customColor";

export function statusColorHandler(variant: Variants): any {
  switch (variant) {
    case "success":
      return { bgcolor: "#D1FADF", color: "#05603A" };
    case "warning":
      return { bgcolor: "#FFF4DE", color: "#FFB016" };
    case "danger":
      return { bgcolor: "#FEE4E2", color: "#912018" };
    case "started":
      return { bgcolor: "#EBE9FE", color: "#4A1FB8" };
    case "custom":
      return { bgcolor: "#F2F4F7", color: "#101828" };
    case "darkDanger":
      return { bgcolor: "#B42318", color: "#FEE4E2" };
    case "primary":
      return { bgcolor: "#BDB4FE", color: "#5925DC" };
      case "customColor":
        return { bgcolor: "#e0f7fa", color: "#006064" };
    default:
      
      return { bgcolor: "#EBE9FE", color: "#4A1FB8" };
  }
}
