import type { FieldRegistry } from "./field-registry";

// Text fields
import { ShortTextField } from "../components/fields/ShortTextField";
import { LongTextField } from "../components/fields/LongTextField";
import { EmailField } from "../components/fields/EmailField";
import { PhoneField } from "../components/fields/PhoneField";
import { PhoneInternationalField } from "../components/fields/PhoneInternationalField";
import { UrlField } from "../components/fields/UrlField";
import { LegalNameField } from "../components/fields/LegalNameField";

// Numeric fields
import { NumberField } from "../components/fields/NumberField";
import { SliderField } from "../components/fields/SliderField";
import { RatingField } from "../components/fields/RatingField";
import { NpsField } from "../components/fields/NpsField";
import { LikertField } from "../components/fields/LikertField";
import { OpinionScaleField } from "../components/fields/OpinionScaleField";

// Selection fields
import { SingleSelectField } from "../components/fields/SingleSelectField";
import { MultiSelectField } from "../components/fields/MultiSelectField";
import { DropdownField } from "../components/fields/DropdownField";
import { BooleanField } from "../components/fields/BooleanField";
import { CountrySelectField } from "../components/fields/CountrySelectField";
import { RankingField } from "../components/fields/RankingField";

// Date/Time fields
import { DateField } from "../components/fields/DateField";
import { DateRangeField } from "../components/fields/DateRangeField";
import { TimeField } from "../components/fields/TimeField";
import { AppointmentField } from "../components/fields/AppointmentField";

// Media fields
import { FileUploadField } from "../components/fields/FileUploadField";
import { SignatureField } from "../components/fields/SignatureField";
import { ImageCaptureField } from "../components/fields/ImageCaptureField";

// Advanced fields
import { AddressField } from "../components/fields/AddressField";
import { PaymentField } from "../components/fields/PaymentField";
import { MatrixField } from "../components/fields/MatrixField";
import { RepeaterField } from "../components/fields/RepeaterField";
import { CalculatedField } from "../components/fields/CalculatedField";
import { HiddenField } from "../components/fields/HiddenField";
import { ScoringField } from "../components/fields/ScoringField";

// Structural fields
import { ConsentField } from "../components/fields/ConsentField";
import { InfoBlockField } from "../components/fields/InfoBlockField";

export const defaultRegistry: FieldRegistry = {
  // Text
  short_text: ShortTextField,
  long_text: LongTextField,
  email: EmailField,
  phone: PhoneField,
  phone_international: PhoneInternationalField,
  url: UrlField,
  legal_name: LegalNameField,

  // Numeric
  number: NumberField,
  slider: SliderField,
  rating: RatingField,
  nps: NpsField,
  likert: LikertField,
  opinion_scale: OpinionScaleField,

  // Selection
  single_select: SingleSelectField,
  multi_select: MultiSelectField,
  dropdown: DropdownField,
  boolean: BooleanField,
  country_select: CountrySelectField,
  ranking: RankingField,

  // Date/Time
  date: DateField,
  date_range: DateRangeField,
  time: TimeField,
  appointment: AppointmentField,

  // Media
  file_upload: FileUploadField,
  signature: SignatureField,
  image_capture: ImageCaptureField,

  // Advanced
  address: AddressField,
  payment: PaymentField,
  matrix: MatrixField,
  repeater: RepeaterField,
  calculated: CalculatedField,
  hidden: HiddenField,
  scoring: ScoringField,

  // Structural
  consent: ConsentField,
  info_block: InfoBlockField,
};
