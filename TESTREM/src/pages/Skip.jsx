import { useState, useEffect } from "react";
import axios from "axios";
import {
  MapPin,
  Truck,
  CheckCircle,
  Calendar,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Menu,
  X,
  Check,
  CarFront,
  Dumbbell,
  Trash,
  Shield,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  Badge,
  Drawer,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import wasteImage from "../assets/wasteImg.jpg";

const steps = [
  { id: "postcode", title: "Postcode", icon: MapPin, completed: true },
  { id: "waste-type", title: "Waste Type", icon: Trash, completed: true },
  {
    id: "select-skip",
    title: "Select Skip",
    icon: Truck,
    completed: false,
  },
  {
    id: "permit-check",
    title: "Permit Check",
    icon: Shield,
    completed: false,
  },
  { id: "choose-date", title: "Choose Date", icon: Calendar, completed: false },
  { id: "payment", title: "Payment", icon: CreditCard, completed: false },
];

const StyledCard = styled(Card)(({ theme }) => ({
  cursor: "pointer",
  transition: "all 0.3s",
  "&:hover": {
    boxShadow: theme.shadows[6],
    transform: "translateY(-4px)",
  },
}));

const Skip = () => {
  const [skips, setSkips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSkip, setSelectedSkip] = useState(null);
  const [currentStep, setCurrentStep] = useState(2);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const fetchSkips = async () => {
      try {
        const response = await axios.get(
          "https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft"
        );
        setSkips(response.data);
      } catch (err) {
        setError("Failed to fetch skips");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSkips();
  }, []);

  const calculateFinalPrice = (priceBeforeVat, vat) =>
    Math.round(priceBeforeVat * (1 + vat / 100));

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="flex-1 p-4 sm:px-6 lg:px-8  ">
        <div
          className={`flex ${
            isSmallScreen ? "justify-between" : "justify-center"
          } items-center mb-4  `}
        >
          <div className="flex flex-col justify-center items-center text-center">
            <h1 className="text-2xl font-bold text-gray-900  ">
              Choose Your Skip Size
            </h1>
            <p className="text-gray-600 mb-6 max-w-2xl  ">
              Select the skip size that best suits your needs
            </p>
          </div>

          {isSmallScreen && (
            <IconButton onClick={() => setDrawerOpen(true)}>
              <Menu />
            </IconButton>
          )}
        </div>

        {error && !isLoading && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-6 text-center">
            🚫 Nothing to display. Please try again later.
          </div>
        )}

        {(isLoading || (error && !isLoading)) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-5">
            {[...Array(6)].map((_, index) => (
              <StyledCard key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-6 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded mb-4"></div>
                  <div className="bg-gray-200 h-10 rounded"></div>
                </CardContent>
              </StyledCard>
            ))}
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {skips.map((skip) => {
              const isSelected = selectedSkip === skip.id;
              const finalPrice = calculateFinalPrice(
                skip.price_before_vat,
                skip.vat
              );
              return (
                <StyledCard
                  key={skip.id}
                  onClick={() =>
                    setSelectedSkip(skip.id === selectedSkip ? null : skip.id)
                  }
                  className={
                    isSelected ? "ring-2 ring-blue-600 scale-105 " : ""
                  }
                >
                  <CardContent className="p-0">
                    <div className="relative rounded-t-lg">
                      <div className="absolute  top-4 right-2 flex flex-col gap-2 z-100">
                        <Badge className="bg-blue-600 text-white px-2 py-1 flex items-center gap-1 text-xs rounded-lg">
                          <Check className="w-3 h-3 " />
                          {skip.size} Yard
                        </Badge>
                      </div>
                      <div className="absolute  bottom-2 right-2 flex flex-col gap-2 z-100">
                        {!skip.allowed_on_road && (
                          <Badge className="bg-green-600 text-white px-2 py-1 flex items-center gap-1 text-xs rounded-lg">
                            <CarFront className="w-3 h-3  " />
                            Not Allowed on Road
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-center">
                        <img
                          src={wasteImage}
                          alt="Skip"
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      {isSelected && (
                        <div className="absolute inset-0  bg-opacity-20 flex items-center justify-center">
                          <CheckCircle className="text-blue-600 w-10 h-10" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {skip.size} Yard Skip
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {skip.hire_period_days} day hire period
                      </p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xl font-bold text-blue-600">
                          £{finalPrice}
                        </span>
                        <span className="text-sm text-gray-500">inc. VAT</span>
                      </div>
                      <Button
                        fullWidth
                        variant={isSelected ? "contained" : "outlined"}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSkip(
                            skip.id === selectedSkip ? null : skip.id
                          );
                        }}
                        className={`
    transition 
    duration-300 
    ease-in-out 
    transform 
    hover:scale-105 
    hover:shadow-lg 
    hover:bg-blue-600 
    hover:text-white 
    hover:border-blue-600
    ${isSelected ? "" : "border border-gray-300"}
  `}
                      >
                        {isSelected ? "Selected" : "Select This Skip"}
                      </Button>
                    </div>
                  </CardContent>
                </StyledCard>
              );
            })}
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Button
            variant="outlined"
            startIcon={<ArrowLeft />}
            onClick={() => console.log("Back")}
          >
            Back
          </Button>
          <div className="flex items-center gap-4">
            {selectedSkip && (
              <span className="text-md font-bold text-gray-600">
                {skips.find((s) => s.id === selectedSkip)?.size} Yard Skip - £
                {calculateFinalPrice(
                  skips.find((s) => s.id === selectedSkip)?.price_before_vat,
                  skips.find((s) => s.id === selectedSkip)?.vat
                )}
              </span>
            )}
          </div>
          <Button
            variant="contained"
            color="primary"
            endIcon={<ArrowRight />}
            disabled={!selectedSkip}
            onClick={() => console.log("Continue")}
          >
            Continue
          </Button>
        </div>
      </div>

      {/* Sidebar / Drawer */}
      {isSmallScreen ? (
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <div className="w-72 p-4  ">
            <div className="flex justify-between items-center mb-4  ">
              <h3 className="text-lg font-semibold">Progress</h3>
              <IconButton onClick={() => setDrawerOpen(false)}>
                <X />
              </IconButton>
            </div>
            <SidebarSteps steps={steps} currentStep={currentStep} />
          </div>
        </Drawer>
      ) : (
        <div className="w-80 border-l border-gray-200  p-6 ">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Progress</h3>
          <SidebarSteps steps={steps} currentStep={currentStep} />
        </div>
      )}
    </div>
  );
};

const SidebarSteps = ({ steps, currentStep }) => {
  return (
    <div className="relative ">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === currentStep;
        const isCompleted = index < currentStep || step.completed;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="relative flex space-x-4 ">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : isCompleted
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {!isLast && (
                <div
                  className={`w-1 flex-1 my-1  ${
                    isCompleted ? "bg-green-600" : "bg-gray-300"
                  }`}
                  style={{ minHeight: 40 }}
                />
              )}
            </div>

            <div>
              <div
                className={`font-medium ${
                  isActive
                    ? "text-blue-600"
                    : isCompleted
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                {step.title}
              </div>
              <div className="text-sm text-gray-500">
                {isActive
                  ? "Current Step"
                  : isCompleted
                  ? "Completed"
                  : "Pending"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Skip;
