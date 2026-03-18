import dynamic from "next/dynamic";

const AcademicReportOptionWrapper = dynamic(
    () => import("./AcademicReportOption").then(mod => mod.AcademicReportOption),
    {
        ssr: false,
        loading: () => <p>Loading...</p>
    }
)

export default AcademicReportOptionWrapper
