<script setup lang="ts">
import { computed, ref } from "vue";
import {
  MtActionMenuGroup,
  MtActionMenuItem,
  MtApp,
  MtAppSidebar,
  MtAvatar,
  MtBadge,
  MtBrand,
  MtButton,
  MtCard,
  MtContentHeader,
  MtIcon,
  MtNav,
  MtPage,
  MtPanel,
  MtSearch,
  MtSelect,
  MtText,
  MtTextarea,
  MtUser,
  MtUserMenu,
  useSnackbar,
  type BreadcrumbItem,
  type NavItem,
  type NavSection,
} from "@shopware-ag/meteor-component-library";

// The folders of the inbox. App Sidebar has no navigate event, so they stay static here.
const folders: NavSection[] = [
  {
    items: [
      { label: "Inbox", icon: "regular-inbox", to: "/inbox", active: true },
      { label: "Assigned to me", icon: "regular-user", to: "/inbox/mine" },
      { label: "Snoozed", icon: "regular-clock", to: "/inbox/snoozed" },
      { label: "Closed", icon: "regular-archive", to: "/inbox/closed" },
    ],
  },
  {
    header: "Labels",
    items: [
      { label: "Billing", icon: "regular-credit-card", to: "/inbox/billing" },
      { label: "Shipping", icon: "regular-truck", to: "/inbox/shipping" },
      { label: "Returns", icon: "regular-shopping-bag-return", to: "/inbox/returns" },
    ],
  },
];

interface Message {
  author: string;
  email: string;
  time: string;
  staff?: boolean;
  text: string;
}

interface Ticket {
  id: string;
  subject: string;
  day: "Today" | "Yesterday";
  time: string;
  status: string;
  customer: { name: string; email: string; city: string; orders: number; value: string };
  messages: Message[];
}

// Sample data. Replace it with the tickets your page loads.
const tickets = ref<Ticket[]>([
  {
    id: "1",
    subject: "Order 10481 has not arrived yet",
    day: "Today",
    time: "9:42",
    status: "open",
    customer: { name: "Jonas Becker", email: "jonas.becker@example.com", city: "Hamburg", orders: 12, value: "€1,284" },
    messages: [
      {
        author: "Jonas Becker",
        email: "jonas.becker@example.com",
        time: "Today, 9:42",
        text: "Hi, I ordered a trail jacket last Monday and the tracking still shows it in the warehouse. Can you check what is going on?",
      },
    ],
  },
  {
    id: "2",
    subject: "Invoice for my last order",
    day: "Today",
    time: "8:15",
    status: "pending",
    customer: { name: "Anna Schmidt", email: "anna.schmidt@example.com", city: "Berlin", orders: 31, value: "€3,912" },
    messages: [
      {
        author: "Anna Schmidt",
        email: "anna.schmidt@example.com",
        time: "Today, 8:02",
        text: "Could you send me the invoice for order 10482 with our company address on it?",
      },
      {
        author: "Max Mustermann",
        email: "support@example.com",
        time: "Today, 8:15",
        staff: true,
        text: "Of course. I have updated the address and attached the new invoice. Is there anything else I can help with?",
      },
    ],
  },
  {
    id: "3",
    subject: "Return label for running shoes",
    day: "Yesterday",
    time: "16:30",
    status: "open",
    customer: { name: "Lea Hoffmann", email: "lea.hoffmann@example.com", city: "Munich", orders: 4, value: "€486" },
    messages: [
      {
        author: "Lea Hoffmann",
        email: "lea.hoffmann@example.com",
        time: "Yesterday, 16:30",
        text: "The shoes are a size too small. How do I get a return label?",
      },
    ],
  },
  {
    id: "4",
    subject: "Discount code is not accepted",
    day: "Yesterday",
    time: "11:05",
    status: "closed",
    customer: { name: "Paul Wagner", email: "paul.wagner@example.com", city: "Cologne", orders: 2, value: "€118" },
    messages: [
      {
        author: "Paul Wagner",
        email: "paul.wagner@example.com",
        time: "Yesterday, 11:05",
        text: "The code WINTER10 from your newsletter says it is invalid at checkout.",
      },
    ],
  },
]);

const term = ref("");
const selectedId = ref("1");
const ticket = computed(() => tickets.value.find(({ id }) => id === selectedId.value)!);

// The tickets, grouped by day and filtered by the search.
const list = computed<NavSection[]>(() =>
  (["Today", "Yesterday"] as const)
    .map((day) => ({
      header: day,
      items: tickets.value
        .filter((item) => item.day === day)
        .filter((item) =>
          `${item.subject} ${item.customer.name}`
            .toLowerCase()
            .includes(term.value.trim().toLowerCase()),
        )
        .map((item) => ({ id: item.id, label: item.subject, to: `/inbox/${item.id}` })),
    }))
    .filter((section) => section.items.length > 0),
);

const timeOf = (item: NavItem) => tickets.value.find(({ id }) => id === item.id)?.time;

const breadcrumb = computed<BreadcrumbItem[]>(() => [
  { label: "Inbox", to: "/inbox", icon: "inbox" },
  { label: ticket.value.subject },
]);

// With Vue Router, each ticket is a route: remove `select()` and compare the item with the
// current route in `isActive` instead.
function isActive(item: NavItem) {
  return item.id === selectedId.value;
}

function select(item: NavItem) {
  if (item.id) selectedId.value = item.id;
}

const statusOptions = [
  { value: "open", label: "Open" },
  { value: "pending", label: "Pending" },
  { value: "closed", label: "Closed" },
];

const reply = ref("");
const { addSnackbar } = useSnackbar();

// Replace it with the request that sends the reply.
function send() {
  ticket.value.messages.push({
    author: "Max Mustermann",
    email: "support@example.com",
    time: "Just now",
    staff: true,
    text: reply.value.trim(),
  });
  reply.value = "";
  addSnackbar({ message: "Reply sent" });
}
</script>

<template>
  <mt-app>
    <template #navigation>
      <mt-panel label="Navigation" resizable :min-width="200" :max-width="320">
        <mt-app-sidebar :sections="folders">
          <template #start>
            <mt-brand title="Shopware" subtitle="Meteor" />
          </template>

          <template #actions>
            <div class="sidebar-actions">
              <mt-button variant="primary" size="default" block>
                <template #iconFront>
                  <mt-icon name="regular-plus-xs" size="var(--scale-size-12)" decorative />
                </template>
                New ticket
              </mt-button>

              <missing-feature title="Counters" kind="slot">
                App Sidebar does not pass on the suffix slot of Nav, so the folders can't show
                how many tickets they hold.
              </missing-feature>
            </div>
          </template>

          <template #end>
            <mt-user-menu name="Max Mustermann" subtitle="Administrator">
              <mt-action-menu-group>
                <mt-action-menu-item icon="regular-sign-out" variant="critical">
                  Log out
                </mt-action-menu-item>
              </mt-action-menu-group>
            </mt-user-menu>
          </template>
        </mt-app-sidebar>
      </mt-panel>
    </template>

    <mt-page :breadcrumb="breadcrumb">
      <template #actions>
        <mt-select
          v-model="ticket.status"
          class="status"
          :options="statusOptions"
          :enable-search="false"
          hide-clearable-button
          small
          aria-label="Status"
        />
      </template>

      <template #start>
        <mt-panel label="Tickets" icon="regular-inbox" resizable>
          <aside class="list" aria-label="Tickets">
            <mt-search v-model="term" size="small" placeholder="Search tickets" />

            <mt-nav :sections="list" label="Tickets" :is-active="isActive" @navigate="select">
              <template #suffix="{ item }">
                <mt-text size="2xs" color="color-text-secondary-default" as="span">
                  {{ timeOf(item) }}
                </mt-text>
              </template>
            </mt-nav>

            <missing-feature title="List item">
              Nav rows have one line. A ticket row needs the customer, a preview of the last
              message, an avatar and an unread style.
            </missing-feature>
          </aside>
        </mt-panel>
      </template>

      <div class="stack">
        <mt-content-header :title="ticket.subject">
          <div class="meta">
            <mt-badge :variant="ticket.status === 'closed' ? 'neutral' : 'info'" size="s">
              {{ statusOptions.find(({ value }) => value === ticket.status)?.label }}
            </mt-badge>
            <mt-text size="xs" color="color-text-secondary-default" as="span">
              Ticket #{{ ticket.id }} from {{ ticket.customer.name }}
            </mt-text>
          </div>
        </mt-content-header>

        <missing-feature title="Message" inline>
          No component for a message in a conversation, so each message is a card.
        </missing-feature>

        <mt-card
          v-for="(message, index) in ticket.messages"
          :key="index"
          :title="message.author"
          :subtitle="`${message.email} · ${message.time}`"
        >
          <template #avatar>
            <mt-avatar
              :first-name="message.author.split(' ')[0]"
              :last-name="message.author.split(' ')[1]"
            />
          </template>

          <template v-if="message.staff" #headerRight>
            <mt-badge size="s">Staff</mt-badge>
          </template>

          <mt-text size="s">{{ message.text }}</mt-text>
        </mt-card>

        <mt-card title="Reply">
          <form class="stack" @submit.prevent="send">
            <mt-textarea v-model="reply" label="Message" placeholder="Write a reply" />

            <div class="actions">
              <mt-button variant="primary" size="default" type="submit" :disabled="!reply.trim()">
                Send reply
              </mt-button>
            </div>
          </form>

          <missing-feature title="Sticky composer" kind="slot" inline>
            Page has no slot at the bottom of its content, so the reply scrolls with the
            conversation.
          </missing-feature>
        </mt-card>
      </div>

      <template #end>
        <mt-panel label="Customer" icon="regular-user" closable resizable>
          <aside class="customer" aria-label="Customer">
            <mt-user :name="ticket.customer.name" :subtitle="ticket.customer.email" />

            <missing-feature title="Description list" inline>
              No component for label and value pairs, so the facts are a plain description list.
            </missing-feature>

            <dl class="facts">
              <mt-text as="dt" size="xs" color="color-text-secondary-default">City</mt-text>
              <mt-text as="dd" size="xs">{{ ticket.customer.city }}</mt-text>
              <mt-text as="dt" size="xs" color="color-text-secondary-default">Orders</mt-text>
              <mt-text as="dd" size="xs">{{ ticket.customer.orders }}</mt-text>
              <mt-text as="dt" size="xs" color="color-text-secondary-default">Lifetime value</mt-text>
              <mt-text as="dd" size="xs">{{ ticket.customer.value }}</mt-text>
            </dl>

            <mt-nav
              label="Other tickets"
              :sections="[
                {
                  header: 'Other tickets',
                  items: tickets
                    .filter((item) => item.id !== ticket.id)
                    .slice(0, 2)
                    .map((item) => ({ id: item.id, label: item.subject, to: `/inbox/${item.id}` })),
                },
              ]"
              @navigate="select"
            />
          </aside>
        </mt-panel>
      </template>
    </mt-page>
  </mt-app>
</template>

<style scoped>
.stack {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--scale-size-16);
  align-content: start;
}

.sidebar-actions {
  display: grid;
  flex: 1;
  gap: var(--scale-size-8);
  min-width: 0;
}

.list,
.customer {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--scale-size-12);
  align-content: start;
  padding: var(--scale-size-8);
}

.status {
  width: 10rem;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--scale-size-8);
}

.actions {
  display: flex;
  justify-content: flex-end;
}

.facts {
  display: grid;
  grid-template-columns: 7rem minmax(0, 1fr);
  gap: var(--scale-size-8) var(--scale-size-12);
  margin: 0;
}

.facts dd {
  margin: 0;
}
</style>
