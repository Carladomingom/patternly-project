"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { css } from "../../../../styled-system/css";
import { createClient } from "@/lib/supabase/client";
import { FIT_PILL_STYLE } from "@/lib/constants";
import type { Pattern } from "@/types";

type Props = {
	pattern: Pattern & { profiles?: { username: string } };
	initialLiked?: boolean;
	isAuthenticated?: boolean;
};

export function PatternCard({
	pattern,
	initialLiked = false,
	isAuthenticated = false,
}: Props) {
	const [liked, setLiked] = useState(initialLiked);
	const [count, setCount] = useState(pattern.likes_count);
	const router = useRouter();
	const supabase = createClient();
	const fit = FIT_PILL_STYLE[pattern.fit] ?? {
		bg: "#FAF8F8",
		color: "#664438",
	};

	async function handleLike(e: React.MouseEvent) {
		e.preventDefault();
		e.stopPropagation();

		if (!isAuthenticated) {
			router.push("/login");
			return;
		}

		const { data, error } = await supabase.rpc("toggle_favorite", {
			p_pattern_id: pattern.id,
		});

		if (!error) {
			const nowLiked = data as boolean;
			setLiked(nowLiked);
			setCount((c) => (nowLiked ? c + 1 : Math.max(c - 1, 0)));
		}
	}

	const cardContent = (
		<article
			className={css({
				backgroundColor: "#FFFFFF",
				border: "1px solid #EDE5E3",
				borderRadius: "16px",
				overflow: "hidden",
				display: "flex",
				flexDirection: "column",
				cursor: "pointer",
				height: "100%",
				transition: "transform 0.18s, box-shadow 0.18s",
				_hover: {
					transform: "translateY(-4px)",
					boxShadow: "0 12px 32px rgba(0,0,0,0.06)",
				},
			})}
		>
			<div
				className={css({
					position: "relative",
					height: "190px",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "#FAF8F8",
					borderBottom: "1px solid #EDE5E3",
				})}
			>
				<span
					className={css({
						position: "absolute",
						top: "12px",
						left: "12px",
						backgroundColor: "#FFFFFF",
						border: "1px solid #EDE5E3",
						borderRadius: "100px",
						padding: "4px 10px",
						fontSize: "11px",
						fontFamily: "dmSans",
						fontWeight: "500",
						color: "#664438",
						zIndex: "1",
					})}
				>
					@{pattern.profiles?.username ?? "usuario"}
				</span>

				<Image
					src={`/svgs/${pattern.svg_key}.svg`}
					alt={pattern.title}
					width={110}
					height={104}
					className={css({
						objectFit: "contain",
					})}
				/>
			</div>

			<div
				className={css({
					padding: "16px",
					display: "flex",
					flexDirection: "column",
					gap: "10px",
					flex: "1",
				})}
			>
				<h3
					className={css({
						fontFamily: "fraunces",
						fontWeight: "300",
						fontStyle: "italic",
						fontSize: "17px",
						color: "#1A0A08",
						lineHeight: "1.2",
					})}
				>
					{pattern.title}
				</h3>

				<div
					className={css({
						height: "1px",
						backgroundColor: "#EDE5E3",
					})}
				/>

				<div
					className={css({
						display: "flex",
						gap: "8px",
						alignItems: "flex-end",
					})}
				>
					<div
						className={css({
							display: "flex",
							flexDirection: "column",
							gap: "2px",
							flex: "1",
						})}
					>
						<span
							className={css({
								fontSize: "10px",
								fontFamily: "dmSans",
								fontWeight: "500",
								textTransform: "uppercase",
								letterSpacing: "0.07em",
								color: "#AA8880",
							})}
						>
							Talla
						</span>
						<span
							className={css({
								fontSize: "13px",
								fontFamily: "dmSans",
								fontWeight: "500",
								color: "#1A0A08",
							})}
						>
							{pattern.size.toUpperCase()}
						</span>
					</div>

					<div
						className={css({
							display: "flex",
							flexDirection: "column",
							gap: "2px",
							flex: "1",
						})}
					>
						<span
							className={css({
								fontSize: "10px",
								fontFamily: "dmSans",
								fontWeight: "500",
								textTransform: "uppercase",
								letterSpacing: "0.07em",
								color: "#AA8880",
							})}
						>
							Punto
						</span>
						<span
							className={css({
								fontSize: "13px",
								fontFamily: "dmSans",
								fontWeight: "500",
								color: "#1A0A08",
							})}
						>
							{pattern.stitch.replace("_", " ")}
						</span>
					</div>

					<div
						className={css({
							display: "flex",
							flexDirection: "column",
							gap: "2px",
							alignItems: "flex-end",
						})}
					>
						<span
							className={css({
								fontSize: "10px",
								fontFamily: "dmSans",
								fontWeight: "500",
								textTransform: "uppercase",
								letterSpacing: "0.07em",
								color: "#AA8880",
							})}
						>
							Silueta
						</span>
						<span
							className={css({
								fontSize: "11px",
								fontFamily: "dmSans",
								fontWeight: "500",
								padding: "3px 8px",
								borderRadius: "4px",
								backgroundColor: fit.bg,
								color: fit.color,
							})}
						>
							{pattern.fit.charAt(0).toUpperCase() +
								pattern.fit.slice(1)}
						</span>
					</div>
				</div>

				<div
					className={css({
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						paddingTop: "2px",
					})}
				>
					<span
						className={css({
							fontSize: "11px",
							fontFamily: "dmSans",
							color: "#AA8880",
						})}
					>
						{count} {count === 1 ? "persona" : "personas"} le{" "}
						{count === 1 ? "dio" : "dieron"} like
					</span>

					<button
						onClick={handleLike}
						className={css({
							display: "flex",
							alignItems: "center",
							gap: "5px",
							backgroundColor: liked ? "#FDECEA" : "#FFFFFF",
							border: "1px solid",
							borderColor: liked ? "#E03020" : "#EDE5E3",
							borderRadius: "100px",
							padding: "5px 12px",
							fontSize: "12px",
							fontFamily: "dmSans",
							fontWeight: "500",
							color: liked ? "#E03020" : "#664438",
							cursor: "pointer",
							transition: "all 0.15s",
							_hover: {
								borderColor: "#E03020",
								color: "#E03020",
							},
						})}
						aria-label={liked ? "Quitar like" : "Dar like"}
					>
						<span
							className={css({
								fontSize: "14px",
								lineHeight: "1",
							})}
						>
							{liked ? "♥" : "♡"}
						</span>
						{count}
					</button>
				</div>
			</div>
		</article>
	);

	if (!isAuthenticated) {
		return (
			<Link
				href="/login"
				className={css({
					textDecoration: "none",
					display: "block",
					height: "100%",
				})}
			>
				{cardContent}
			</Link>
		);
	}

	return (
		<Link
			href={`/patron/${pattern.id}`}
			className={css({
				textDecoration: "none",
				display: "block",
				height: "100%",
			})}
		>
			{cardContent}
		</Link>
	);
}
