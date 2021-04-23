<template>
  <div class="container">
    <h1>Scenario:</h1>
    <p>
      You are the owner of a drinking vending machine company. You want to make
      your business transformation with technology to expand your company and
      products to people around the country. You design to improve your vending
      machine to send information to a centralize system, tracking what products
      are nearly out of item for each machine, and send any signals to system
      admins to know.
    </p>
    <p>Please design and implement the system with these conditions below:</p>
    <ul>
      <li>
        Customers can buy products from vending machine. When they buy any
        product, the numbers of product should be decrease from the machine
      </li>
      <li>System admins have to know all vending machine locations</li>
      <li>
        When existing product quantity is less than 10, the vending machine will
        send any signals to the system admin. (You can design the signals you
        want to use such as Line, E-Mail, notification on website, etc.)
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
</style>
