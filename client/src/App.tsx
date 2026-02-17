import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import CandidatureSakhoForm from "./pages/CandidatureSakhoForm";
import CandidatureArchispaceForm from "./pages/CandidatureArchispaceForm";
import PartenariatForm from "./pages/PartenariatForm";
import ImmobilierForm from "./pages/ImmobilierForm";
import ConciergerieForm from "./pages/ConciergerieForm";
import ArchispaceForm from "./pages/ArchispaceForm";
import CentralForm from "./pages/CentralForm";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/immobilier" component={ImmobilierForm} />
      <Route path="/archispace" component={ArchispaceForm} />
      <Route path="/conciergerie" component={ConciergerieForm} />
      <Route path="/partenariat" component={PartenariatForm} />
      <Route path="/candidature-sakho" component={CandidatureSakhoForm} />
      <Route path="/candidature-archispace" component={CandidatureArchispaceForm} />
      <Route path="/formulaire-central" component={CentralForm} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
