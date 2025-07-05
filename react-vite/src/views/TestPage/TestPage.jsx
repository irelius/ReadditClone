import { useLocation, useParams, useSearchParams } from "react-router-dom";
import "./TestPage.css";

export default function TestPage() {
    const params = useParams()
    console.log('test', params)

	return <div className="dfc aic font-white">test</div>;
}
