import { Box, BoxProps, Flex, Text } from "@chakra-ui/react";

export const Star = ({
  type = "full",
  size,
}: {
  type?: "full" | "half" | "empty";
  size: BoxProps["w"];
}) => {
  return <Box className={`star ${type}`} w={size} h={size}></Box>;
};

const StarRating = ({
  rating,
  color = "current",
  size = "12px",
  showValue = true,
}: {
  rating: number;
  color?: string;
  size?: BoxProps["w"];
  showValue?: boolean;
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <Flex alignItems="center" gap={2}>
      <Flex gap="1px">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return <Star key={index} size={size} />;
          }
          if (index === fullStars && hasHalfStar) {
            return <Star key={index} type="half" size={size} />;
          }
          return <Star key={index} type="empty" size={size} />;
        })}
      </Flex>
      {showValue && (
        <Text fontSize="xs" lineHeight={1} color={color}>
          {rating.toFixed(1)}
        </Text>
      )}
    </Flex>
  );
};

export default StarRating;
