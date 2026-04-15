export type Profile = {
	id: string;
	username: string;
	email: string;
	avatar_url: string | null;
	created_at: string;
};

export type Pattern = {
	id: string;
	user_id: string;
	title: string;
	size: Size;
	neck: Neck;
	sleeves: Sleeves;
	stitch: Stitch;
	yarn_weight: YarnWeight;
	fit: Fit;
	is_public: boolean;
	svg_key: string;
	materials: Material[];
	steps: Step[];
	likes_count: number;
	created_at: string;
	updated_at: string;
	profiles?: Pick<Profile, "username" | "avatar_url">;
};

export type Favorite = {
	id: string;
	user_id: string;
	pattern_id: string;
	created_at: string;
};

export type NewsletterSubscriber = {
	id: string;
	email: string;
	created_at: string;
};

// Enum tipos para las opciones de patrón

export type Size = "s" | "m" | "l";
export type Neck = "redondo" | "pico" | "alto";
export type Sleeves = "anchas" | "ajustadas" | "rectas";
export type Stitch = "punto_bajo" | "punto_alto" | "relieve";
export type YarnWeight = "fino" | "medio" | "grueso";
export type Fit = "ajustado" | "normal" | "oversize";

// Contenido de materiales y pasos

export type Material = {
	name: string;
	quantity: number;
	unit: string;
};

export type Step = {
	order: number;
	description: string;
};

// Configuración para crear/editar patrón

export type PatternConfig = {
	title: string;
	size: Size;
	neck: Neck;
	sleeves: Sleeves;
	stitch: Stitch;
	yarn_weight: YarnWeight;
	fit: Fit;
	is_public: boolean;
};

// Filtros para la página de patrones

export type SortOption = "recientes" | "populares";

export type PatternFilters = {
	search: string;
	fit: Fit | "todos";
	stitch: Stitch | "todos";
	sleeves: Sleeves | "todos";
	sort: SortOption;
};

// ── API respuestas ───────────────────────────────────────────────────────────────

export type ApiResponse<T> =
	| { data: T; error: null }
	| { data: null; error: string };
