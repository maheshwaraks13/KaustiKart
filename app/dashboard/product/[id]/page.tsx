"use client";
import { useParams } from "next/navigation";
import ProductForm from "@/components/ProductForm";
export default function Edit() { const { id } = useParams<{ id: string }>(); return <ProductForm id={id} />; }
