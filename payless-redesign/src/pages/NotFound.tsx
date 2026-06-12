import Seo from "@/components/Seo";
import { GoldButton } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <>
      <Seo title="העמוד לא נמצא | PAYLESS" />
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden text-center">
        <div className="grid-overlay absolute inset-0" />
        <div className="relative">
          <div className="text-[9rem] font-black leading-none text-gradient-gold md:text-[13rem]">404</div>
          <h1 className="mt-2 text-2xl font-extrabold">העמוד שחיפשת לא נמצא</h1>
          <p className="mt-3 text-muted-foreground">ייתכן שהקישור השתנה או שהעמוד הוסר</p>
          <div className="mt-8">
            <GoldButton to="/">חזרה לעמוד הבית</GoldButton>
          </div>
        </div>
      </section>
    </>
  );
}
