import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  AlertCircle,
  CheckCircle2,
  Cigarette,
  Heart,
  RotateCcw,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import { useSensor } from "../App";

const RISK_LEVELS = [
  { max: 0.2, label: "Negligible", color: "#2ED47A" },
  { max: 0.4, label: "Low", color: "#7CD42E" },
  { max: 0.6, label: "Moderate", color: "#FFB020" },
  { max: 0.8, label: "High", color: "#FF7A20" },
  { max: 1.0, label: "Very High", color: "#FF4D4F" },
];

function getRiskLevel(prob: number) {
  return (
    RISK_LEVELS.find((r) => prob <= r.max) ??
    RISK_LEVELS[RISK_LEVELS.length - 1]
  );
}

const CARDIO_CATEGORIES = [
  {
    max: 25,
    label: "Low",
    color: "text-success",
    bg: "bg-success/15",
    border: "border-success/30",
  },
  {
    max: 50,
    label: "Moderate",
    color: "text-warning",
    bg: "bg-warning/15",
    border: "border-warning/30",
  },
  {
    max: 75,
    label: "High",
    color: "text-orange-400",
    bg: "bg-orange-400/15",
    border: "border-orange-400/30",
  },
  {
    max: 100,
    label: "Critical",
    color: "text-danger",
    bg: "bg-danger/15",
    border: "border-danger/30",
  },
];

function getCardioCategory(score: number) {
  return (
    CARDIO_CATEGORIES.find((c) => score <= c.max) ??
    CARDIO_CATEGORIES[CARDIO_CATEGORIES.length - 1]
  );
}

function getCumulativeRiskCategory(score: number) {
  if (score < 20) return { label: "Safe", color: "text-success" };
  if (score < 50) return { label: "Caution", color: "text-warning" };
  if (score < 100) return { label: "Elevated", color: "text-orange-400" };
  return { label: "Severe", color: "text-danger" };
}

function getAQILabel(aqi: number) {
  if (aqi < 20) return { label: "Good", color: "text-success" };
  if (aqi < 40) return { label: "Moderate", color: "text-warning" };
  if (aqi < 60) return { label: "Unhealthy", color: "text-orange-400" };
  return { label: "Hazardous", color: "text-danger" };
}

const TOTAL_OPTIONAL_FIELDS = 14;

export default function Features() {
  const {
    diseaseProb,
    cardioScore,
    baseAQI,
    cumulativeRisk,
    riskHistory,
    resetCumulativeRisk,
  } = useSensor();

  // Section 1: Personal
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState("");
  const [bmi, setBmi] = useState("");

  // Section 2: Cardiovascular & Respiratory
  const [asthma, setAsthma] = useState(false);
  const [cardioDisease, setCardioDisease] = useState(false);
  const [smoking, setSmoking] = useState(false);
  const [exSmoker, setExSmoker] = useState(false);

  // Section 3: Vulnerable / Pre-existing
  const [diabetes, setDiabetes] = useState(false);
  const [copd, setCopd] = useState(false);
  const [immunocomp, setImmunocomp] = useState(false);
  const [kidneyDisease, setKidneyDisease] = useState(false);
  const [neurological, setNeurological] = useState(false);
  const [pregnancy, setPregnancy] = useState(false);

  // Section 4: Lifestyle
  const [exercise, setExercise] = useState("");
  const [hoursIndoors, setHoursIndoors] = useState(16);
  const [airPurifier, setAirPurifier] = useState(false);

  // Section 5: Medications
  const [bpMed, setBpMed] = useState(false);
  const [inhaler, setInhaler] = useState(false);
  const [immunosuppressant, setImmunosuppressant] = useState(false);

  // Section 6: Environment
  const [roomSize, setRoomSize] = useState("");
  const [peopleInRoom, setPeopleInRoom] = useState(1);
  const [hasPets, setHasPets] = useState(false);

  const adjustmentFactor = useMemo(() => {
    let factor = 0;
    if (age > 60) factor += 0.2;
    if (age < 12) factor += 0.1;
    if (bmi === "obese") factor += 0.1;
    if (asthma) factor += 0.15;
    if (cardioDisease) factor += 0.1;
    if (smoking) factor += 0.25;
    if (exSmoker) factor += 0.05;
    if (diabetes) factor += 0.08;
    if (copd) factor += 0.2;
    if (immunocomp) factor += 0.15;
    if (kidneyDisease) factor += 0.08;
    if (neurological) factor += 0.05;
    if (pregnancy) factor += 0.1;
    if (exercise === "active") factor -= 0.1;
    if (exercise === "sedentary") factor += 0.05;
    if (hoursIndoors > 20) factor += 0.1;
    if (airPurifier) factor -= 0.05;
    if (bpMed) factor += 0.05;
    if (inhaler) factor += 0.1;
    if (immunosuppressant) factor += 0.15;
    if (roomSize === "small") factor += 0.1;
    if (hasPets) factor += 0.05;
    return Math.max(factor, 0);
  }, [
    age,
    bmi,
    asthma,
    cardioDisease,
    smoking,
    exSmoker,
    diabetes,
    copd,
    immunocomp,
    kidneyDisease,
    neurological,
    pregnancy,
    exercise,
    hoursIndoors,
    airPurifier,
    bpMed,
    inhaler,
    immunosuppressant,
    roomSize,
    hasPets,
  ]);

  const filledFields = useMemo(() => {
    let count = 0;
    if (gender) count++;
    if (bmi) count++;
    if (asthma) count++;
    if (cardioDisease) count++;
    if (smoking) count++;
    if (exSmoker) count++;
    if (diabetes) count++;
    if (copd) count++;
    if (immunocomp) count++;
    if (kidneyDisease) count++;
    if (neurological) count++;
    if (pregnancy) count++;
    if (exercise) count++;
    if (airPurifier) count++;
    return count;
  }, [
    gender,
    bmi,
    asthma,
    cardioDisease,
    smoking,
    exSmoker,
    diabetes,
    copd,
    immunocomp,
    kidneyDisease,
    neurological,
    pregnancy,
    exercise,
    airPurifier,
  ]);

  const profileCompleteness = Math.round(
    (filledFields / TOTAL_OPTIONAL_FIELDS) * 100,
  );
  const personalizedAQI = Math.round(baseAQI * (1 + adjustmentFactor));
  const riskLevel = getRiskLevel(diseaseProb);
  const cardioCategory = getCardioCategory(cardioScore);
  const cumulativeCategory = getCumulativeRiskCategory(cumulativeRisk);
  const aqiLabel = getAQILabel(personalizedAQI);

  const recommendations: string[] = useMemo(() => {
    const tips: string[] = [];
    if (baseAQI > 40)
      tips.push(
        "Air quality is poor — consider leaving the area or improving ventilation.",
      );
    if (asthma)
      tips.push("Keep your rescue inhaler nearby and monitor for wheezing.");
    if (cardioDisease)
      tips.push(
        "Limit physical exertion in poor air. Monitor heart rate and blood pressure.",
      );
    if (smoking)
      tips.push(
        "Avoid smoking indoors as it significantly worsens indoor air quality.",
      );
    if (copd)
      tips.push(
        "COPD patients should consider a medical-grade air purifier and oxygen monitoring.",
      );
    if (diabetes)
      tips.push(
        "Monitor blood sugar more frequently — air pollution can affect insulin sensitivity.",
      );
    if (immunocomp)
      tips.push(
        "Immunocompromised individuals face higher infection risk. Ensure thorough ventilation.",
      );
    if (kidneyDisease)
      tips.push(
        "Kidney disease patients should minimize chemical exposure from cleaning products.",
      );
    if (neurological)
      tips.push(
        "Some air pollutants can affect neurological conditions — seek fresh air regularly.",
      );
    if (pregnancy)
      tips.push(
        "Pregnant individuals should avoid elevated CO₂ and CO areas as they may affect fetal oxygen supply.",
      );
    if (bpMed)
      tips.push(
        "Monitor blood pressure more frequently when air quality indicators are elevated.",
      );
    if (inhaler)
      tips.push(
        "Pre-medicate with your bronchodilator before entering areas with high particulate readings.",
      );
    if (immunosuppressant)
      tips.push(
        "Immunosuppressants lower resistance to respiratory infections — wear a mask in polluted environments.",
      );
    if (exercise === "sedentary")
      tips.push(
        "Sedentary individuals accumulate higher exposure — take regular outdoor breaks when outdoor AQI is good.",
      );
    if (!airPurifier && baseAQI > 20)
      tips.push(
        "Consider using a HEPA air purifier to improve indoor air quality.",
      );
    if (peopleInRoom > 5)
      tips.push(
        `${peopleInRoom} people in one space increases disease spread probability significantly. Ventilate frequently.`,
      );
    if (hoursIndoors > 20)
      tips.push(
        "Spending over 20 hours indoors greatly increases cumulative exposure risk. Open windows regularly.",
      );
    if (roomSize === "small" && peopleInRoom > 2)
      tips.push(
        "Small room with multiple occupants — maintain 15 min/hr fresh air exchanges.",
      );
    if (tips.length === 0)
      tips.push(
        "Air quality is within safe parameters for your health profile. Stay monitoring!",
      );
    return tips;
  }, [
    baseAQI,
    asthma,
    cardioDisease,
    smoking,
    copd,
    diabetes,
    immunocomp,
    kidneyDisease,
    neurological,
    pregnancy,
    bpMed,
    inhaler,
    immunosuppressant,
    exercise,
    airPurifier,
    peopleInRoom,
    hoursIndoors,
    roomSize,
  ]);

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Profile Completeness */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Profile Completeness
          </span>
          <span
            className="text-xs font-bold"
            style={{
              color:
                profileCompleteness > 70
                  ? "#2ED47A"
                  : profileCompleteness > 40
                    ? "#FFB020"
                    : "#9AA8C7",
            }}
          >
            {profileCompleteness}%
          </span>
        </div>
        <Progress value={profileCompleteness} className="h-2" />
        <p className="text-[10px] text-muted-foreground mt-1.5">
          Fill in more details for a more accurate personalized risk score.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Health Profile Accordion */}
        <div className="lg:col-span-2">
          <Accordion
            type="multiple"
            defaultValue={["personal", "cardio"]}
            className="space-y-2"
          >
            {/* Section 1: Personal Details */}
            <AccordionItem
              value="personal"
              className="glass-card border-white/8 rounded-xl overflow-hidden px-4"
            >
              <AccordionTrigger className="text-sm font-semibold text-foreground py-3 hover:no-underline">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-neon" />
                  Personal Details
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Label className="text-xs text-muted-foreground w-16 shrink-0">
                    Age
                  </Label>
                  <div className="flex-1">
                    <Slider
                      data-ocid="features.age.input"
                      value={[age]}
                      onValueChange={([v]) => setAge(v)}
                      min={1}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <span className="text-sm font-bold text-foreground w-8 text-right">
                    {age}
                  </span>
                  {age >= 60 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-warning/15 text-warning border border-warning/30">
                      Senior
                    </span>
                  )}
                  {age < 12 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-neon/15 text-cyan-neon border border-cyan-neon/30">
                      Child
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">
                      Gender
                    </Label>
                    <Select
                      data-ocid="features.gender.select"
                      value={gender}
                      onValueChange={setGender}
                    >
                      <SelectTrigger className="h-8 text-xs bg-white/5 border-border">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer_not">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">
                      BMI Range
                    </Label>
                    <Select
                      data-ocid="features.bmi.select"
                      value={bmi}
                      onValueChange={setBmi}
                    >
                      <SelectTrigger className="h-8 text-xs bg-white/5 border-border">
                        <SelectValue placeholder="Select BMI" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="underweight">
                          Underweight (&lt;18.5)
                        </SelectItem>
                        <SelectItem value="normal">
                          Normal (18.5–24.9)
                        </SelectItem>
                        <SelectItem value="overweight">
                          Overweight (25–29.9)
                        </SelectItem>
                        <SelectItem value="obese">Obese (30+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 2: Cardiovascular & Respiratory */}
            <AccordionItem
              value="cardio"
              className="glass-card border-white/8 rounded-xl overflow-hidden px-4"
            >
              <AccordionTrigger className="text-sm font-semibold text-foreground py-3 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-danger" />
                  Cardiovascular &amp; Respiratory
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      label: "Asthma",
                      value: asthma,
                      onChange: setAsthma,
                      id: "asthma",
                    },
                    {
                      label: "Cardiovascular Disease",
                      value: cardioDisease,
                      onChange: setCardioDisease,
                      id: "cardio",
                    },
                    {
                      label: "Smoking",
                      value: smoking,
                      onChange: setSmoking,
                      id: "smoking",
                    },
                    {
                      label: "Ex-Smoker",
                      value: exSmoker,
                      onChange: setExSmoker,
                      id: "ex_smoker",
                    },
                  ].map(({ label, value, onChange, id }) => (
                    <div
                      key={id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-white/3 hover:bg-white/5 transition-colors"
                    >
                      <Checkbox
                        data-ocid={`features.${id}.checkbox`}
                        id={id}
                        checked={value}
                        onCheckedChange={(v) => onChange(!!v)}
                      />
                      <Label
                        htmlFor={id}
                        className="text-xs text-muted-foreground cursor-pointer"
                      >
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 3: Vulnerable Conditions */}
            <AccordionItem
              value="vulnerable"
              className="glass-card border-white/8 rounded-xl overflow-hidden px-4"
            >
              <AccordionTrigger className="text-sm font-semibold text-foreground py-3 hover:no-underline">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-warning" />
                  Vulnerable / Pre-existing Conditions
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      label: "Diabetes",
                      value: diabetes,
                      onChange: setDiabetes,
                      id: "diabetes",
                    },
                    {
                      label: "COPD / Emphysema",
                      value: copd,
                      onChange: setCopd,
                      id: "copd",
                    },
                    {
                      label: "Immunocompromised",
                      value: immunocomp,
                      onChange: setImmunocomp,
                      id: "immunocomp",
                    },
                    {
                      label: "Chronic Kidney Disease",
                      value: kidneyDisease,
                      onChange: setKidneyDisease,
                      id: "kidney",
                    },
                    {
                      label: "Neurological Condition",
                      value: neurological,
                      onChange: setNeurological,
                      id: "neuro",
                    },
                    {
                      label: "Pregnancy",
                      value: pregnancy,
                      onChange: setPregnancy,
                      id: "pregnancy",
                    },
                  ].map(({ label, value, onChange, id }) => (
                    <div
                      key={id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-white/3 hover:bg-white/5 transition-colors"
                    >
                      <Checkbox
                        data-ocid={`features.${id}.checkbox`}
                        id={id}
                        checked={value}
                        onCheckedChange={(v) => onChange(!!v)}
                      />
                      <Label
                        htmlFor={id}
                        className="text-xs text-muted-foreground cursor-pointer"
                      >
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 4: Lifestyle */}
            <AccordionItem
              value="lifestyle"
              className="glass-card border-white/8 rounded-xl overflow-hidden px-4"
            >
              <AccordionTrigger className="text-sm font-semibold text-foreground py-3 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Cigarette className="w-4 h-4 text-violet-neon" />
                  Lifestyle
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">
                    Exercise Frequency
                  </Label>
                  <Select
                    data-ocid="features.exercise.select"
                    value={exercise}
                    onValueChange={setExercise}
                  >
                    <SelectTrigger className="h-8 text-xs bg-white/5 border-border">
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">
                        Sedentary (little/no exercise)
                      </SelectItem>
                      <SelectItem value="light">Light (1–2x/week)</SelectItem>
                      <SelectItem value="moderate">
                        Moderate (3–4x/week)
                      </SelectItem>
                      <SelectItem value="active">Active (5+/week)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Hours Indoors/Day
                    </Label>
                    <span className="text-xs font-bold text-foreground">
                      {hoursIndoors}h
                    </span>
                  </div>
                  <Slider
                    data-ocid="features.hours_indoors.input"
                    value={[hoursIndoors]}
                    onValueChange={([v]) => setHoursIndoors(v)}
                    min={0}
                    max={24}
                    step={1}
                  />
                  {hoursIndoors > 20 && (
                    <p className="text-[10px] text-warning mt-1">
                      ⚠ High indoor exposure increases cumulative risk
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/3">
                  <Checkbox
                    data-ocid="features.air_purifier.checkbox"
                    id="air_purifier"
                    checked={airPurifier}
                    onCheckedChange={(v) => setAirPurifier(!!v)}
                  />
                  <Label
                    htmlFor="air_purifier"
                    className="text-xs text-muted-foreground cursor-pointer"
                  >
                    Uses air purifier at home
                  </Label>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 5: Medications */}
            <AccordionItem
              value="medications"
              className="glass-card border-white/8 rounded-xl overflow-hidden px-4"
            >
              <AccordionTrigger className="text-sm font-semibold text-foreground py-3 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-success" />
                  Medications
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-2">
                  {[
                    {
                      label: "Blood pressure medication",
                      value: bpMed,
                      onChange: setBpMed,
                      id: "bp_med",
                      tip: "Monitor BP more frequently in poor air",
                    },
                    {
                      label: "Inhaler / bronchodilator",
                      value: inhaler,
                      onChange: setInhaler,
                      id: "inhaler",
                      tip: "Pre-medicate before entering polluted areas",
                    },
                    {
                      label: "Immunosuppressants",
                      value: immunosuppressant,
                      onChange: setImmunosuppressant,
                      id: "immunosuppressant",
                      tip: "Wear a mask in elevated pollution environments",
                    },
                  ].map(({ label, value, onChange, id, tip }) => (
                    <div
                      key={id}
                      className="p-2.5 rounded-lg bg-white/3 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox
                          data-ocid={`features.${id}.checkbox`}
                          id={id}
                          checked={value}
                          onCheckedChange={(v) => onChange(!!v)}
                        />
                        <Label
                          htmlFor={id}
                          className="text-xs text-muted-foreground cursor-pointer"
                        >
                          {label}
                        </Label>
                      </div>
                      {value && (
                        <p className="text-[10px] text-cyan-neon mt-1 pl-6">
                          💡 {tip}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 6: Environment */}
            <AccordionItem
              value="environment"
              className="glass-card border-white/8 rounded-xl overflow-hidden px-4"
            >
              <AccordionTrigger className="text-sm font-semibold text-foreground py-3 hover:no-underline">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-neon" />
                  Environment
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">
                    Room Size
                  </Label>
                  <Select
                    data-ocid="features.room_size.select"
                    value={roomSize}
                    onValueChange={setRoomSize}
                  >
                    <SelectTrigger className="h-8 text-xs bg-white/5 border-border">
                      <SelectValue placeholder="Select room size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (&lt;20m²)</SelectItem>
                      <SelectItem value="medium">Medium (20–50m²)</SelectItem>
                      <SelectItem value="large">Large (&gt;50m²)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <Label className="text-xs text-muted-foreground">
                      People in Room
                    </Label>
                    <span className="text-xs font-bold text-foreground">
                      {peopleInRoom}
                    </span>
                  </div>
                  <Slider
                    data-ocid="features.people_in_room.input"
                    value={[peopleInRoom]}
                    onValueChange={([v]) => setPeopleInRoom(v)}
                    min={1}
                    max={20}
                    step={1}
                  />
                  {peopleInRoom > 5 && (
                    <p className="text-[10px] text-warning mt-1">
                      ⚠ Crowded room increases disease spread risk
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/3">
                  <Checkbox
                    data-ocid="features.pets.checkbox"
                    id="pets"
                    checked={hasPets}
                    onCheckedChange={(v) => setHasPets(!!v)}
                  />
                  <Label
                    htmlFor="pets"
                    className="text-xs text-muted-foreground cursor-pointer"
                  >
                    Presence of pets (dander sensitivity)
                  </Label>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Right Column: AQI + Metrics */}
        <div className="space-y-4">
          {/* Smart AQI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5"
          >
            <h2 className="text-sm font-semibold text-foreground mb-3">
              Smart AQI (Personalized)
            </h2>
            <div className="rounded-xl bg-white/5 p-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Base AQI</span>
                <span className="text-foreground font-mono">{baseAQI}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Adjustment</span>
                <span className="text-warning font-mono">
                  +{(adjustmentFactor * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-px bg-border my-1" />
              <div className="flex justify-between text-sm">
                <span className="text-foreground font-semibold">
                  Personalized AQI
                </span>
                <span className={`font-bold font-mono ${aqiLabel.color}`}>
                  {personalizedAQI}
                </span>
              </div>
              <div className="text-center pt-1">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full bg-white/5 ${aqiLabel.color}`}
                >
                  {aqiLabel.label}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Disease Spread Probability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-card p-5"
          >
            <h2 className="text-sm font-semibold text-foreground mb-1">
              Disease Spread Probability
            </h2>
            <p className="text-xs text-muted-foreground mb-3">
              Based on CO₂, NH₃ &amp; occupancy
            </p>
            <div className="text-center mb-3">
              <p
                className="text-4xl font-bold"
                style={{ color: riskLevel.color }}
              >
                {diseaseProb.toFixed(2)}
              </p>
              <span
                className="inline-block mt-1.5 px-3 py-0.5 rounded-full text-xs font-bold border"
                style={{
                  color: riskLevel.color,
                  borderColor: `${riskLevel.color}40`,
                  background: `${riskLevel.color}15`,
                }}
              >
                {riskLevel.label}
              </span>
            </div>
            <div className="relative h-3 rounded-full overflow-hidden bg-white/5">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
                style={{
                  width: `${diseaseProb * 100}%`,
                  background:
                    "linear-gradient(90deg, #2EE6D6, #FFB020, #FF4D4F)",
                }}
              />
            </div>
          </motion.div>

          {/* Cardiovascular Stress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-5"
          >
            <h2 className="text-sm font-semibold text-foreground mb-1">
              Cardiovascular Stress
            </h2>
            <p className="text-xs text-muted-foreground mb-3">
              CO levels, temp &amp; humidity deviation
            </p>
            <div className="text-center mb-3">
              <p className={`text-4xl font-bold ${cardioCategory.color}`}>
                {cardioScore}
              </p>
              <span
                className={`inline-block mt-1.5 px-3 py-0.5 rounded-full text-xs font-bold border ${cardioCategory.bg} ${cardioCategory.color} ${cardioCategory.border}`}
              >
                {cardioCategory.label}
              </span>
            </div>
            <div className="relative h-3 rounded-full overflow-hidden bg-white/5 mb-2">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                animate={{ width: `${cardioScore}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                  background:
                    "linear-gradient(90deg, #2ED47A, #FFB020, #FF7A20, #FF4D4F)",
                }}
              />
            </div>
            {cardioScore >= 50 && (
              <div
                className={`flex items-center gap-2 rounded-lg p-2 ${cardioCategory.bg} border ${cardioCategory.border}`}
              >
                <AlertCircle
                  className={`w-3.5 h-3.5 shrink-0 ${cardioCategory.color}`}
                />
                <p className={`text-[10px] ${cardioCategory.color}`}>
                  {cardioScore >= 75
                    ? "Critical: Evacuate and seek medical attention."
                    : "Elevated: Improve ventilation."}
                </p>
              </div>
            )}
          </motion.div>

          {/* Long-Term Risk */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-5"
          >
            <div className="flex items-start justify-between mb-1">
              <h2 className="text-sm font-semibold text-foreground">
                Long-Term Risk
              </h2>
              <Button
                data-ocid="features.risk.reset_button"
                size="sm"
                variant="ghost"
                onClick={resetCumulativeRisk}
                className="h-6 px-2 text-muted-foreground hover:text-foreground -mt-0.5"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Cumulative session exposure
            </p>
            <div className="text-center mb-3">
              <p className={`text-3xl font-bold ${cumulativeCategory.color}`}>
                {cumulativeRisk.toFixed(1)}
              </p>
              <span
                className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold bg-white/5 ${cumulativeCategory.color}`}
              >
                {cumulativeCategory.label}
              </span>
            </div>
            <div className="h-20">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={riskHistory}>
                  <Tooltip
                    contentStyle={{
                      background: "rgba(17,28,46,0.95)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "8px",
                      fontSize: "11px",
                      color: "#EAF1FF",
                    }}
                    formatter={(v: number) => [v.toFixed(2), "Risk"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#7C5CFF"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-5"
      >
        <h2 className="text-sm font-semibold text-foreground mb-3">
          Personalized Health Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {recommendations.map((tip, i) => (
            <motion.div
              key={tip}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-white/3 border border-white/5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-neon shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {tip}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
