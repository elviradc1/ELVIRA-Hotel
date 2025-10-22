import { colors, typography } from "../../../utils/theme";
import {
  PageContent,
  PageHeader,
  TableContainer,
} from "../../../components/shared/page-layouts";
import { useHotelContext } from "../../../hooks/useHotelContext";

export function Overview() {
  const { staffInfo } = useHotelContext();

  return (
    <PageContent>
      <PageHeader
        title="Overview"
        userName={staffInfo?.fullName}
        icon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        }
      />

      <TableContainer>
        <p
          style={{
            color: colors.text.secondary,
            textAlign: "center",
            fontSize: typography.fontSize.base,
            margin: 0,
          }}
        >
          Overview dashboard content will go here
        </p>
      </TableContainer>
    </PageContent>
  );
}
