import {Component, Vue} from "vue-property-decorator";
import PokemonItem from "@/components/pokemon-item/pokemon-item.vue";
import axios from "axios";
import {BListGroup, BListGroupItem, BPagination, BFormSelect} from "bootstrap-vue";

import {PokemonType} from "types";

@Component({
    components: {
        PokemonItem,
        BListGroup,
        BListGroupItem,
        BPagination,
        BFormSelect,
    }
})
export default class PokemonList extends Vue {
    pokemonList: PokemonType[] | [] = [];
    error: string;
    isLoading: boolean = true;
    paging = {
        current: 1,
        rows: 10,
        limit: 10,
    }

    mounted() {
        this.getPokemons()
    }

    getPokemons():void {
        this.isLoading = true;
        axios.get(`https://pokeapi.co/api/v2/pokemon`)
            .then((res) => {
                this.pokemonList = res.data.results.map((i: any) => {
                    let id = i.url.replace('https://pokeapi.co/api/v2/pokemon/', '').replace('/', '');
                    return { id, ...i }
                })
                this.$store.dispatch('actionPokemons', this.pokemonList)
                this.isLoading = false;
            })
            .catch((e) => {
                this.error = e;
                this.isLoading = false;
            })
    }

    handleClick(id: number):void {
        this.$router.push(`pokemon/${id}`)
    }

    get slicePokemons() {
        return this.pokemonList.slice(this.paging.current, this.paging.current + this.paging.limit)
    }
}
