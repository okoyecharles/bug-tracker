import React from "react";
import TicketsByType from "./TicketsByType";
import { storeType } from "../../../redux/configureStore";
import TicketsByStatus from "./TicketsByStatus";
import TicketsByPriority from "./TicketsByPriority";
import TicketStatsLoader from "./Loader";
import { a, useTrail } from "@react-spring/web";

interface Props {
  ticketStore: storeType["tickets"];
}

const TicketStats: React.FC<Props> = ({
  ticketStore: { error, loading, tickets },
}) => {
  const trail = useTrail(3, {
    from: { opacity: 0, y: 40 },
    to: { opacity: 1, y: 0 },
  });

  return tickets.length && !loading ? (
    <div className="flex flex-col md:flex-row xl:flex-col gap-4">
      <a.div style={trail[0]} className="row-span-1 bg-gray-900 p-4 rounded shadow flex-1">
        <TicketsByType tickets={tickets} />
      </a.div>
      <a.div style={trail[1]} className="row-span-1 bg-gray-900 p-4 rounded shadow flex-1">
        <TicketsByStatus tickets={tickets} />
      </a.div>
      <a.div style={trail[2]} className="row-span-1 bg-gray-900 p-4 rounded shadow flex-1">
        <TicketsByPriority tickets={tickets} />
      </a.div>
    </div>
  ) : loading ? (
    <TicketStatsLoader />
  ) : (
    <div className="no-tickets flex flex-col justify-center xl:flex-1">
      <h3 className="text-blue-500/90 text-lg mb-4 font-bold text-center">
        You don't have enough tickets
      </h3>
      <p className="text-center text-ss text-gray-400">
        You need at least 1 ticket to view these statistics. You can create a
        ticket on a project you have been assigned to.
      </p>
    </div>
  );
};

export default TicketStats;
