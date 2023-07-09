import { Animate } from "react-simple-animate";
import * as twStyles from "../styles/styles";
import { sigmarOne } from "../../../fonts";
import classnames from "classnames";

export const LevelComplete = () => {
  return (
    <div className={twStyles.levelCompleteWrapper}>
      <div className={twStyles.levelCompleteContainer}>
        {/* <Animate
          play
          duration={0.4}
          delay={0.2}
          start={{
            opacity: 0.3,
            transform: "scale(1) translateY(30px)",
          }}
          end={{
            opacity: 1,
            transform: "scale(1) translateY(0px)",
          }}
          easeType="ease-out"
        > */}
          <div className={twStyles.levelCompleteBadge}>
            <div>stars</div>
            <div className={classnames(sigmarOne.className, twStyles.levelCompleteText)}>YOU WIN!</div>
            <div>stars</div>
          </div>
        {/* </Animate> */}
      </div>
    </div>
  );
};
