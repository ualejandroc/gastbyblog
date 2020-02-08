import React from "react";
import PropTypes from "prop-types";
require("core-js/fn/array/from");

import { FaHome } from "react-icons/fa/";
import { FaSearch } from "react-icons/fa/";
import { FaEnvelope } from "react-icons/fa/";
import { FaTag } from "react-icons/fa/";
import {FaLightbulb} from "react-icons/fa/";
import {FaFileInvoice} from "react-icons/fa/";
import {FaCommentDots} from "react-icons/fa/";
import {FaMedal} from "react-icons/fa/";






import Item from "./Item";
import Expand from "./Expand";

/////
import { StaticQuery, graphql } from "gatsby";

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.itemList = React.createRef();

    const pages = props.pages.map(page => ({
      to: page.node.fields.slug,
      label: page.node.frontmatter.menuTitle
        ? page.node.frontmatter.menuTitle
        : page.node.frontmatter.title
    }));

    this.items = [
      { to: "/", label: "Home", icon: FaHome },
      { to: "/category/", label: "Categories", icon: FaTag },
      // { to: "/search/", label: "Search", icon: FaSearch },
      // ...pages,
      { to: "/contact/", label: "Contact", icon: FaEnvelope }
    ];

    this.categories = [];

    this.renderedItems = []; // will contain references to rendered DOM elements of menu
  }

  state = {
    open: false,
    hiddenItems: []
  };

  static propTypes = {
    path: PropTypes.string.isRequired,
    fixed: PropTypes.bool.isRequired,
    screenWidth: PropTypes.number.isRequired,
    fontLoaded: PropTypes.bool.isRequired,
    pages: PropTypes.array.isRequired,
    theme: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.renderedItems = this.getRenderedItems();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.path !== prevProps.path ||
      this.props.fixed !== prevProps.fixed ||
      this.props.screenWidth !== prevProps.screenWidth ||
      this.props.fontLoaded !== prevProps.fontLoaded
    ) {
      if (this.props.path !== prevProps.path) {
        this.closeMenu();
      }
      this.hideOverflowedMenuItems();
    }
  }

  getRenderedItems = () => {
    const itemList = this.itemList.current;
    return Array.from(itemList.children);
  };

  hideOverflowedMenuItems = () => {
    const PADDING_AND_SPACE_FOR_MORELINK = this.props.screenWidth >= 1024 ? 60 : 0;

    const itemsContainer = this.itemList.current;
    const maxWidth = itemsContainer.offsetWidth - PADDING_AND_SPACE_FOR_MORELINK;

    this.setState({ hiddenItems: [] }); // clears previous state

    const menu = this.renderedItems.reduce(
      (result, item) => {
        item.classList.add("item");
        item.classList.remove("hideItem");

        const currentCumulativeWidth = result.cumulativeWidth + item.offsetWidth;
        result.cumulativeWidth = currentCumulativeWidth;

        if (!item.classList.contains("more") && currentCumulativeWidth > maxWidth) {
          const link = item.querySelector("a");

          item.classList.add("hideItem");
          item.classList.remove("item");
          result.hiddenItems.push({
            to: link.getAttribute("data-slug"),
            label: link.text
          });
        }
        return result;
      },
      { visibleItems: [], cumulativeWidth: 0, hiddenItems: [] }
    );

    this.setState(prevState => ({ hiddenItems: menu.hiddenItems }));
  };

  toggleMenu = e => {
    e.preventDefault();

    if (this.props.screenWidth < 1024) {
      this.renderedItems.map(item => {
        const oldClass = this.state.open ? "showItem" : "hideItem";
        const newClass = this.state.open ? "hideItem" : "showItem";

        if (item.classList.contains(oldClass)) {
          item.classList.add(newClass);
          item.classList.remove(oldClass);
        }
      });
    }

    this.setState(prevState => ({ open: !prevState.open }));
  };

  closeMenu = e => {
    //e.preventDefault();

    if (this.state.open) {
      this.setState({ open: false });
      if (this.props.screenWidth < 1024) {
        this.renderedItems.map(item => {
          if (item.classList.contains("showItem")) {
            item.classList.add("hideItem");
            item.classList.remove("item");
          }
        });
      }
    }
  };

  render() {
    const { screenWidth, theme } = this.props;
    const { open } = this.state;

    return (
      <React.Fragment>
        <StaticQuery
          query={graphql`
            query PostsQueries {
              posts: allMarkdownRemark(
                filter: { fileAbsolutePath: { regex: "//posts/[0-9]+.*--/" } }
                sort: { fields: [fields___prefix], order: DESC }
              ) {
                edges {
                  node {
                    excerpt
                    fields {
                      slug
                      prefix
                    }
                    frontmatter {
                      title
                      category
                      author
                      cover {
                        children {
                          ... on ImageSharp {
                            fluid(maxWidth: 800, maxHeight: 360) {
                              ...GatsbyImageSharpFluid_withWebp
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
              site {
                siteMetadata {
                  facebook {
                    appId
                  }
                }
              }
            }
          `}
          render={data => (
            <div>
              {data.posts.edges.map(edge => {
                const {
                  node: {
                    frontmatter: { category }
                  }
                } = edge;

                if (category && category != null) {
                  this.categories = this.categories.filter(e => e != category);

                  this.categories.push(category);
                }

                // return <div></div>;
              })}
              <div>
                {/* <ul className="itemList">
                {this.categories.map(category => {
                  return <li className="item">{category + " " + this.categories.length}</li>;
                })}
              </ul> */}
              </div>
            </div>
          )}
        />

        {/* <div>
          {this.categories.map((category, index) => {
            this.items.push({
              to: category,
              label: category + " " + parseInt(index).toString(),
              icon: FaHome
            });
          })}
        </div> */}

        <div>
          {
            // this.items.push({
            //   to: this.categories[0],
            //   label: this.categories[0]+this.items.length ,
            //   icon: FaHome
            // })
          }
        </div>

        <div>
          {this.categories.map((category, index) => {
            this.items = this.items.filter(e => e.label != category);
            let cat =''              
                if(category.split(" ").length<1){
                  cat=category
                }else{
                  cat=category.split(" ")[0] 
                for(let i =1;i<category.split(" ").length;i++){
                  cat= cat + "-" +  category.split(" ")[i] 
                }
              }
              ////////
              let icons=''
              if(cat.toLowerCase()=='ideas'){
                icons=FaLightbulb
              }
               
              if(cat.toLowerCase()=='guides'){
                icons=FaFileInvoice
              }
               
              if(cat.toLowerCase()=='tips'){
                icons=FaCommentDots
              }
               
              if(cat.toLowerCase()=='inspiration'){
                icons=FaMedal
              }
               /////////
            this.items.splice(1,0,{
              to: "/category/" + cat.toLowerCase(),
              label: category,
              icon: icons
            });
          })}
        </div>

        <div>
          {
          //  this.items[0]= this.items[3]         
          }
        </div>

        {/* <div>
          {
           this.items[0]= this.items.findIndex(cat => cat.label =='Home')
          }
        </div> */}

        <nav className={`menu ${open ? "open" : ""}`} rel="js-menu">
          <ul className="itemList" ref={this.itemList}>
            {this.items.map(item => (
              <Item item={item} key={item.label} icon={item.icon} theme={theme} />
            ))}
          </ul>
          {this.state.hiddenItems.length > 0 && <Expand onClick={this.toggleMenu} theme={theme} />}
          {open && screenWidth >= 1024 && (
            <ul className="hiddenItemList">
              {this.state.hiddenItems.map(item => (
                <Item item={item} key={item.label} hiddenItem theme={theme} />
              ))}
            </ul>
          )}
        </nav>

        {/* --- STYLES --- */}
        <style jsx>{`
          .menu {
            align-items: center;
            background: ${theme.color.neutral.white};
            bottom: 0;
            display: flex;
            flex-grow: 1;
            left: 0;
            max-height: ${open ? "1000px" : "50px"};
            padding: 0 ${theme.space.inset.s};
            position: fixed;
            width: 100%;
            z-index: 1;
            transition: all ${theme.time.duration.default};
          }

          .itemList {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            list-style: none;
            margin: 0;
            padding: 0; /* 0 ${theme.space.s}; */
            position: relative;
            width: 100%;
          }

          @below desktop {
            .menu {
              &::after {
                position: absolute;
                content: "";
                left: ${theme.space.m};
                right: ${theme.space.m};
                top: 0;
                height: 1px;
                background: ${theme.color.brand.primary};
              }

              &.open {
                padding: ${theme.space.inset.m};
              }

              :global(.homepage):not(.fixed) & {
                bottom: -100px;
              }
            }
          }

          @from-width desktop {
            .menu {
              border-top: none;
              background: transparent;
              display: flex;
              position: relative;
              justify-content: flex-end;
              padding-left: 50px;
              transition: none;
            }

            .itemList {
              justify-content: flex-end;
              padding: 0;
            }

            .hiddenItemList {
              list-style: none;
              margin: 0;
              position: absolute;
              background: ${theme.background.color.primary};
              border: 1px solid ${theme.line.color};
              top: 48px;
              right: ${theme.space.s};
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              padding: ${theme.space.m};
              border-radius: ${theme.size.radius.small};
              border-top-right-radius: 0;


              &:after {
                content: "";
                background: ${theme.background.color.primary};
                z-index: 10;
                top: -10px;
                right: -1px;
                width: 44px;
                height: 10px;
                position: absolute;
                border-left: 1px solid ${theme.line.color};
                border-right: 1px solid ${theme.line.color};
              }

              :global(.homepage):not(.fixed) & {
                border: 1px solid transparent;
                background: color(white alpha(-10%));
                top: 50px;

                &:after {
                  top: -11px;
                  border-left: 1px solid transparent;
                  border-right: 1px solid transparent;
                  background: color(white alpha(-10%));
                }
              }

              :global(.fixed) & {
                top: 44px;
              }
            }
          }
        `}</style>
      </React.Fragment>
    );
  }
}

export default Menu;
